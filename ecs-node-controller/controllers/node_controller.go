/*
Copyright 2021.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"k8s.io/api/policy/v1beta1"
	"k8s.io/apimachinery/pkg/apis/meta/v1/unstructured"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/record"
	"strconv"
	"strings"
	"time"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	meta "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	ecsrequst "github.com/aliyun/alibaba-cloud-sdk-go/sdk/requests"
	ecs "github.com/aliyun/alibaba-cloud-sdk-go/services/ecs"
)

// NodeReconciler reconciles a Node object
type NodeReconciler struct {
	client.Client
	OriginClient            kubernetes.Interface
	Scheme                  *runtime.Scheme
	recorder                record.EventRecorder
	hostNameToInstanceId    map[string]string
	deleteNodeChan          chan string
	addNodeChan             chan string
	evictPodOfNodeChan      chan string
	ecsClient               *ecs.Client
	lastSyncEcsInstanceTime time.Time
	instanceCache           map[string]string
	taintChan               chan string
	revertNodeChan          chan string
	RegionId                string
	Ak                      string
	Sk                      string
}

type jsonOp string

type JsonOperation struct {
	Op    jsonOp      `json:"op,omitempty"`
	Path  string      `json:"path,omitempty"`
	Value interface{} `json:"value,omitempty"`
}

const (
	Json_Remove  jsonOp = "remove"
	Json_Replace jsonOp = "replace"
	Jons_Add     jsonOp = "add"
)

//type PatchNode struct {
//	Status PatchNodeStatus `json:"status,omitempty" protobuf:"bytes,3,opt,name=status"`
//}
//
//type PatchNodeStatus struct {
//	Conditions []corev1.NodeCondition `json:"conditions,omitempty" patchStrategy:"merge" patchMergeKey:"type" protobuf:"bytes,4,rep,name=conditions"`
//}

//+kubebuilder:rbac:groups=core,resources=nodes,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=core,resources=nodes/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=core,resources=nodes/finalizers,verbs=update

// Reconcile is part of the main kubernetes reconciliation loop which aims to
// move the current state of the cluster closer to the desired state.
// TODO(user): Modify the Reconcile function to compare the state specified by
// the Node object against the actual cluster state, and then
// perform operations to make the cluster state reflect the state specified by
// the user.
//
// For more details, check Reconcile and its Result here:
// - https://pkg.go.dev/sigs.k8s.io/controller-runtime@v0.8.3/pkg/reconcile
func (r *NodeReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {

	//for debug
	//freshNode := &corev1.Node{}
	//req.NamespacedName.Name = "kubernetes-work1"
	// _ = r.Get(ctx, req.NamespacedName, freshNode)
	// var conditons  []corev1.NodeCondition
	// for _, condition := range freshNode.Status.Conditions {
	//		if string(condition.Type) != "ecs-node-controller"{
	//			conditons = append(conditons,condition)
	//		}
	//	}
	////err := r.Status().Update(ctx,freshNode)
	//patchNode := corev1.Node{}
	//patchNode.Status.Conditions = conditons
	//patch, err1 := json.Marshal(patchNode)
	//err1 = r.Status().Patch(ctx, freshNode, client.RawPatch(types.MergePatchType, patch))
	//fmt.Println(err1)

	logger := log.FromContext(ctx)

	// your logic here
	//nodeRef := r.getNodeRef(req.Name)
	//r.recorder.Event(nodeRef,"Warning","test","test")
	node := &corev1.Node{}
	//eventList := &corev1.EventList{}
	err := r.Get(ctx, req.NamespacedName, node)
	//r.List(ctx,eventList,client.MatchingLabels{})
	//podList := corev1.PodList{}
	//r.List(ctx,&podList, client.MatchingFields(fields.Set{"spec.nodeName": node.Name}))
	if errors.IsNotFound(err) {
		//代表Node被删除
		logger.Info("in Reconcile thread delete node " + node.Name)
		r.deleteNodeChan <- node.Name
		return ctrl.Result{}, nil
	}
	if err != nil {
		logger.Error(err, "exception is ")
		return ctrl.Result{}, err
	}
	fmt.Println("in Reconcile thread add node " + node.Name)
	r.addNodeChan <- node.Name
	return ctrl.Result{}, nil
}

func (r *NodeReconciler) syncNodeToInstnace() {

	for {
		select {
		case nodeName := <-r.deleteNodeChan:
			if _, ok := r.hostNameToInstanceId[nodeName]; ok {
				delete(r.hostNameToInstanceId, nodeName)
			}
		case nodeName := <-r.addNodeChan:
			fmt.Printf("hostmap is %+v \n", r.hostNameToInstanceId)
			if _, ok := r.hostNameToInstanceId[nodeName]; ok {
				break
			} else {
				//时间在5min以内，可以复用上次请求的数据
				if time.Now().Sub(r.lastSyncEcsInstanceTime).Seconds() < 3600 {
					if instanceId, ok := r.instanceCache[nodeName]; ok {
						r.hostNameToInstanceId[nodeName] = instanceId
						break
					}
				}

				r.instanceCache = make(map[string]string, 100)

				request := ecs.CreateDescribeInstancesRequest()
				request.Scheme = "https"
				request.PageSize = "100"

				//TODO:翻页处理
				response, err := r.ecsClient.DescribeInstances(request)
				if err != nil {
					//重试
					r.addNodeChan <- nodeName
					fmt.Printf("error in describe instance %+v \n", err)
					break
				}

				fmt.Printf("nodename is %s \n", nodeName)

				for _, instance := range response.Instances.Instance {
					var instnaceName string
					//优先使用主机名，如果主机名不在的话，使用实例名。貌似控制台的展示也是这个逻辑
					fmt.Printf("instance.Host is %s , instance.instancename is %s\n", instance.Hostname, instance.InstanceName)
					if len(instance.Hostname) != 0 {
						instnaceName = instance.Hostname
					} else if len(instance.InstanceName) != 0 {
						instnaceName = instance.InstanceName
					} else {
						fmt.Printf("get instance name is err %+v \n", instance)
						//TODO logit
						continue
					}
					fmt.Printf("node is %s , instance name is %s\n", nodeName, instnaceName)
					if instnaceName == nodeName {
						r.hostNameToInstanceId[nodeName] = instance.InstanceId
					}

					if len(r.instanceCache) <= 100 {
						r.instanceCache[instnaceName] = instance.InstanceId
					}
				}
				if instanceName, ok := r.hostNameToInstanceId[nodeName]; ok {
					fmt.Printf("instance name %s instance id is %s \n", nodeName, instanceName)
				} else {
					fmt.Printf("instance name %s get no instance id \n", nodeName)
				}
				fmt.Printf("instance cache map is %+v\n", r.instanceCache)
				r.lastSyncEcsInstanceTime = time.Now()
			}
		}
	}

}

func (r *NodeReconciler) getEventFromAliyun(ctx context.Context, instanceIds []string) []ecs.InstanceSystemEventType {
	fmt.Printf("instance ids is %+v", instanceIds)
	logger := log.FromContext(ctx)
	request := ecs.CreateDescribeInstanceHistoryEventsRequest()
	request.Scheme = "https"
	request.ResourceType = "instance"
	request.ResourceId = &instanceIds
	request.InstanceEventCycleStatus = &[]string{"Scheduled", "Avoided", "Executing", "Executed", "Canceled", "Failed", "Inquiring"}
	//request.EventPublishTimeStart = time.Now().Add(-5 * time.Hour).UTC().Format(time.RFC3339)
	request.PageSize = "100"
	pageNum := 1
	var ret []ecs.InstanceSystemEventType
	for {
		request.PageNumber = ecsrequst.NewInteger(pageNum)
		response, err := r.ecsClient.DescribeInstanceHistoryEvents(request)
		if err != nil {
			//打印错误，并返回成功的列表
			fmt.Printf("query aliyun event is error %+v, response is %+v", err, response)
			logger.Info(err.Error(), "=======", response)
			return ret
		}
		fmt.Println("get from aliyun openapi ", response)
		ret = append(ret, response.InstanceSystemEventSet.InstanceSystemEventType...)
		pageNum++
		if pageNum > response.TotalCount/response.PageSize+1 {
			break
		}
	}
	logger.Info("ret from get event from aliyun ", "ret", ret)
	fmt.Printf("ret from get event from aliyun %+v \n", ret)
	return ret
}

func (r *NodeReconciler) getEventStatusFromAliyunByEventId(ctx context.Context, eventIds []string) []ecs.InstanceSystemEventType {
	logger := log.FromContext(ctx)
	request := ecs.CreateDescribeInstanceHistoryEventsRequest()
	request.Scheme = "https"
	request.EventId = &eventIds
	request.InstanceEventCycleStatus = &[]string{"Scheduled", "Avoided", "Executing", "Executed", "Canceled", "Failed", "Inquiring"}
	response, err := r.ecsClient.DescribeInstanceHistoryEvents(request)
	fmt.Printf("get from aliyun in getEventStatusFromAliyunByEventId ret is %+v, error is %+v", response, err)
	logger.Info("get from aliyun in getEventStatusFromAliyunByEventId", "ret ", response, "error", err)
	return response.InstanceSystemEventSet.InstanceSystemEventType
}

func (r *NodeReconciler) syncEventFromEcsToApiServer() {

	ticker := time.Tick(60 * time.Second)

	for {
		select {
		case <-ticker:
			ctx := context.TODO()
			logger := log.FromContext(ctx)
			if len(r.hostNameToInstanceId) == 0 {
				break
			}
			instanceIdToNodeName := make(map[string]string, len(r.hostNameToInstanceId))
			fmt.Printf("begin to syncEventFromEcsToApiServer \n")
			//request := ecs.CreateDescribeInstanceHistoryEventsRequest()
			//request.Scheme = "https"
			//request.ResourceType = "instance"
			instanceIds := make([]string, 0, len(r.hostNameToInstanceId))
			for nodeName, instanceId := range r.hostNameToInstanceId {
				instanceIdToNodeName[instanceId] = nodeName
				instanceIds = append(instanceIds, instanceId)
			}
			fmt.Printf("instance len is %d \n", len(instanceIds))
			logger.Info("instance len is ", "len", len(instanceIds))
			//request.ResourceId = &instanceIds
			//request.InstanceEventCycleStatus = &[]string{"Scheduled","Avoided","Executing","Executed","Canceled","Failed","Inquiring"}
			//request.EventPublishTimeStart = r.lastSyncEventTimeStr
			//request.EventPublishTimeStart = time.Now().UTC().Format(time.RFC3339)
			//eventList := &corev1.EventList{}
			fmt.Printf("begin to get events  \n")
			eventList := &unstructured.UnstructuredList{}
			eventList.SetGroupVersionKind(schema.GroupVersionKind{
				Group:   "",
				Kind:    "event",
				Version: "v1",
			})
			r.List(ctx, eventList, client.MatchingFields{"source": "ecs-node-controller"})
			existedEvent := make(map[string]int, len(eventList.Items))
			for _, e := range eventList.Items {
				name, _ := e.Object["reason"].(string)
				existedEvent[name] = 0
			}
			fmt.Printf("all events is %+v \n", existedEvent)
			//request.PageSize = "100"
			//response, err := r.ecsClient.DescribeInstanceHistoryEvents(request)
			//if err != nil{
			//	fmt.Println(err)
			//	break
			//}
			fmt.Printf("begin to get events from aliyun cs \n")
			eventsFromAliyun := r.getEventFromAliyun(ctx, instanceIds)
			for _, event := range eventsFromAliyun {
				eventReason := event.EventId + "|" + event.EventType.Name + ":" + event.EventCycleStatus.Name
				if _, ok := existedEvent[eventReason]; ok {
					logger.Info(eventReason + " is already exists so continue")
					continue
				}

				nodeName := instanceIdToNodeName[event.InstanceId]
				message := "eventId:" + event.EventId + " status:" + event.EventCycleStatus.Name
				if event.EventCycleStatus.Name == "Inquiring" || event.EventCycleStatus.Name == "Scheduled" {
					message = message + " will be force execte at " + event.NotBefore
				}
				//获取Node
				nameSpacedName := types.NamespacedName{
					Name:      nodeName,
					Namespace: "",
				}
				freshNode := &corev1.Node{}
				err := r.Client.Get(ctx, nameSpacedName, freshNode)
				if errors.IsNotFound(err) {
					//节点已经存在
					logger.Error(err, "node not exists")
					continue
				}
				if err != nil {
					//其他异常，先记录
					logger.Error(err, "get node error")
					continue

				}
				//发送事件到apiserver
				nodeRef := r.getNodeRef(nodeName)
				r.recorder.Event(nodeRef, "Warning", eventReason, message)
				if event.EventCycleStatus.Name == "Inquiring" || event.EventCycleStatus.Name == "Scheduled" || event.EventCycleStatus.Name == "Executed" {
					//只修改Condition
					//	//注释掉，后续使用tolerate的方案
					//freshNode.Spec.Unschedulable = true
					//err = r.Client.Update(ctx,freshNode)
					////为了等待cache更新
					//time.Sleep(1*time.Second)
					//UPDATELABEL:
					//	err = r.Client.Get(ctx,nameSpacedName, freshNode)
					//	conditionUpdated := false
					//	for i, condition := range freshNode.Status.Conditions {
					//		if string(condition.Type) == "ecs-node-controller"{
					//			freshNode.Status.Conditions[i].LastHeartbeatTime = now
					//			freshNode.Status.Conditions[i].Message = "eventId:" + event.EventId+ " and status:" +event.EventCycleStatus.Name + " time:" +r.lastSyncEventTimeStr
					//			freshNode.Status.Conditions[i].Status = corev1.ConditionFalse
					//			conditionUpdated = true
					//			break
					//		}
					//	}
					//	if !conditionUpdated { // There was no condition found, let's create one
					now := meta.Time{Time: time.Now()}
					patchNode := corev1.Node{}
					patchNode.Status.Conditions = append(patchNode.Status.Conditions,
						corev1.NodeCondition{
							Type:               corev1.NodeConditionType("ecs-node-controller"),
							Status:             corev1.ConditionFalse,
							LastHeartbeatTime:  now,
							LastTransitionTime: now,
							Reason:             "Ecs.SystemMainTance",
							Message:            "eventId:" + event.EventId + " and status:" + event.EventCycleStatus.Name + " time:" + event.EventFinishTime,
						},
					)
					//}
					patch, err := json.Marshal(patchNode)
					//err := r.Status().Update(ctx,freshNode)
					err = r.Status().Patch(ctx, freshNode, client.RawPatch(types.StrategicMergePatchType, patch))
					if err != nil {
						fmt.Printf("in sync Event update status error err %s \n", err)
					}
					r.taintChan <- nodeName
				}
				if event.EventCycleStatus.Name == "Avoided" || event.EventCycleStatus.Name == "Canceled" || event.EventCycleStatus.Name == "Executed" {
					r.revertNodeChan <- nodeName + "|" + event.EventId
				}
			}
		}
	}
}

func (r *NodeReconciler) getNodeObject(ctx context.Context, nodeName string) (*corev1.Node, error) {
	logger := log.FromContext(ctx)
	nameSpacedName := types.NamespacedName{
		Name:      nodeName,
		Namespace: "",
	}
	freshNode := &corev1.Node{}
	err := r.Client.Get(ctx, nameSpacedName, freshNode)
	if errors.IsNotFound(err) {
		//节点已经存在
		logger.Error(err, "node not exists")
		return nil, err
	}
	if err != nil {
		//其他异常，先记录
		logger.Error(err, "get node error")
		return nil, err
	}
	return freshNode, nil
}

func (r *NodeReconciler) RunCommandByAliyunAssiant(ctx context.Context, command, instanceId string, timeout int) (string, string, string, error) {
	logger := log.FromContext(ctx)
	request := ecs.CreateRunCommandRequest()
	request.Scheme = "https"
	request.CommandContent = command
	var instanceIds []string
	instanceIds = append(instanceIds, instanceId)
	request.InstanceId = &instanceIds
	request.Type = "RunShellScript"
	request.Timeout = ecsrequst.NewInteger(timeout)
	response, err := r.ecsClient.RunCommand(request)
	logger.Info("in runcommand ", "ret", response, "err", err)
	if !response.IsSuccess() {
		logger.Error(err, "in runcommand")
		return "", "", "", errors.NewBadRequest("aliyun error")
	}
	describeCommandRequest := ecs.CreateDescribeInvocationResultsRequest()
	describeCommandRequest.CommandId = response.CommandId
	describeCommandRequest.Scheme = "https"
	times := 1
	for {
		describeCommandResponse, err := r.ecsClient.DescribeInvocationResults(describeCommandRequest)
		logger.Info("in runcommand describe command", "ret", describeCommandResponse, "err", err, "times", times)
		if !describeCommandResponse.IsSuccess() {
			logger.Error(err, "in describe command", "times:", times)
			return "", "", "", errors.NewBadRequest("aliyun error")
		}
		invocationResult := describeCommandResponse.Invocation.InvocationResults.InvocationResult[0]
		if invocationResult.InvokeRecordStatus == "Finished" || invocationResult.InvokeRecordStatus == "Failed" || invocationResult.InvokeRecordStatus == "Stopped" {
			return strconv.Itoa(int(invocationResult.ExitCode)), invocationResult.Output, invocationResult.ErrorInfo, nil
		}
		time.Sleep(10 * time.Second)
	}
}

func (r *NodeReconciler) revertNodeCondition() {
	for {
		select {
		case tmp := <-r.revertNodeChan:
			nodeName := strings.Split(tmp, "|")[0]
			eventId := strings.Split(tmp, "|")[1]
			ctx := context.TODO()
			logger := log.FromContext(ctx)
			freshNode, err := r.getNodeObject(ctx, nodeName)
			if err != nil {
				continue
			}
			updated := false
			var eventIdFromNodeCondition string

			for _, condition := range freshNode.Status.Conditions {
				if string(condition.Type) == "ecs-node-controller" {
					if condition.Status == corev1.ConditionFalse {
						eventIdFromNodeCondition = strings.Split(strings.Split(condition.Message, " ")[0], ":")[1]
						updated = true
						break
					}
				}
			}
			if updated {
				var eventIds []string
				eventIds = append(eventIds, eventId)
				events := r.getEventStatusFromAliyunByEventId(ctx, eventIds)
				if len(events) != 1 {
					logger.Info("events cnt not right", "events", events)
				}
				event := events[0]
				if event.EventCycleStatus.Name != "Avoided" && event.EventCycleStatus.Name != "Canceled" && event.EventCycleStatus.Name != "Executed" {
					logger.Info("event not finish ", "event", event)
					continue
				}
				if eventIdFromNodeCondition != event.EventId {
					logger.Info("not this event set condition skip")
					continue
				}
				retCode, _, _, err := r.RunCommandByAliyunAssiant(ctx, "uptime", r.hostNameToInstanceId[nodeName], 20)
				if err != nil {
					logger.Error(err, "in revertNodeCondition check instanceId available")
					continue
				}
				if retCode != "0" {
					continue
				}
				now := meta.Time{Time: time.Now()}
				patchNode := corev1.Node{}
				patchNode.Status.Conditions = append(patchNode.Status.Conditions,
					corev1.NodeCondition{
						Type:               corev1.NodeConditionType("ecs-node-controller"),
						Status:             corev1.ConditionTrue,
						LastHeartbeatTime:  now,
						LastTransitionTime: now,
						Reason:             "Ecs.SystemMainTance",
						Message:            "eventId:" + event.EventId + " and status:" + event.EventCycleStatus.Name + " has dealed",
					},
				)
				patch, err := json.Marshal(patchNode)
				err = r.Status().Patch(ctx, freshNode, client.RawPatch(types.StrategicMergePatchType, patch))
				if err != nil {
					fmt.Printf("in sync Event update status error err %s \n", err)
				}
				r.taintChan <- nodeName
			}

		}

	}

}

func (r *NodeReconciler) markNodeTrained() {

	for {
		select {
		case nodeName := <-r.taintChan:
			ctx := context.TODO()
			logger := log.FromContext(ctx)
			logger.Info("in markNodeTrained get node " + nodeName)
			nameSpacedName := types.NamespacedName{
				Name:      nodeName,
				Namespace: "",
			}
			freshNode := &corev1.Node{}
			err := r.Client.Get(ctx, nameSpacedName, freshNode)
			if errors.IsNotFound(err) {
				//节点已经存在
				logger.Error(err, "node not exists")
				continue
			}
			if err != nil {
				//其他异常，先记录
				logger.Error(err, "get node error")
				continue
			}

			for _, condition := range freshNode.Status.Conditions {
				if string(condition.Type) == "ecs-node-controller" {
					if condition.Status == corev1.ConditionFalse {
						updated := true
						for _, taint := range freshNode.Spec.Taints {
							if taint.Key == "ecs-not-ready" && taint.Effect == corev1.TaintEffectNoSchedule {
								updated = false
								continue
							}
						}
						if updated {
							now := meta.Time{Time: time.Now()}
							patchNode := corev1.Node{}
							patchNode.Spec.Taints = append(freshNode.Spec.Taints, corev1.Taint{
								Key:       "ecs-not-ready",
								Value:     "SystemMantence",
								Effect:    corev1.TaintEffectNoSchedule,
								TimeAdded: &now,
							})
							patch, err := json.Marshal(patchNode)
							logger.Error(err, "in update taint json marshal")
							//TODO:这个地方可能有问题，使用了Patch，但是用了Merge的方案，后续
							err = r.Patch(ctx, freshNode, client.RawPatch(types.StrategicMergePatchType, patch))
							logger.Error(err, "in update taint patch")
						}
						r.evictPodOfNodeChan <- nodeName

					} else if condition.Status == corev1.ConditionTrue {
						updated := false
						var path string
						for index, taint := range freshNode.Spec.Taints {
							if taint.Key == "ecs-not-ready" && taint.Effect == corev1.TaintEffectNoSchedule {
								updated = true
								path = "/spec/taints/" + strconv.Itoa(index)
								continue
							}
						}
						if updated {
							var values []JsonOperation
							value := JsonOperation{
								Op:   Json_Remove,
								Path: path,
							}
							values = append(values, value)
							patch, _ := json.Marshal(values)
							err = r.Patch(ctx, freshNode, client.RawPatch(types.JSONPatchType, patch))
							logger.Info("in 2 update taint patch", "err", err)

						}
					}
				}
			}
		}
	}

}

func (r *NodeReconciler) FullyReconcile() {
	ticker := time.Tick(600 * time.Second)
	for {
		select {
		case <-ticker:
			ctx := context.TODO()
			nodeList := corev1.NodeList{}
			r.List(ctx, &nodeList)
			for _, node := range nodeList.Items {
				r.taintChan <- node.Name
				r.addNodeChan <- node.Name
				r.evictPodOfNodeChan <- node.Name
				r.revertNodeChan <- node.Name
			}
		}
	}
}

func (r *NodeReconciler) restartScheduledNode() {

	for {
		select {
		case nodeName := <-r.evictPodOfNodeChan:
			ctx := context.TODO()
			logger := log.FromContext(ctx)
			logger.Info("in restartScheduledNode get node " + nodeName)
			freshNode, err := r.getNodeObject(ctx, nodeName)
			if err != nil {
				//其他异常，先记录
				logger.Error(err, "get node error")
				continue
			}
			evicted := false
			var eventIdFromNodeCondition string
			for _, condition := range freshNode.Status.Conditions {
				if string(condition.Type) == "ecs-node-controller" {
					unscheduled := false
					for _, taint := range freshNode.Spec.Taints {
						logger.Info("in restartScheduledNode", "nodeName:", nodeName, "taint:", taint)
						if taint.Key == "ecs-not-ready" && taint.Effect == corev1.TaintEffectNoSchedule {
							unscheduled = true
							break
						}
					}
					if unscheduled && condition.Status == corev1.ConditionFalse {
						eventIdFromNodeCondition = strings.Split(strings.Split(condition.Message, " ")[0], ":")[1]
						logger.Info("in restartScheduledNode", "nodeName:", nodeName, "eventIdFromNodeCondition:", eventIdFromNodeCondition)
						var eventIds []string
						eventIds = append(eventIds, eventIdFromNodeCondition)
						events := r.getEventStatusFromAliyunByEventId(ctx, eventIds)
						if len(events) != 1 {
							logger.Info("events cnt not right", "events", events)
						}
						event := events[0]
						logger.Info("in restartScheduledNode", "nodeName:", nodeName, "event:", event)
						if event.EventCycleStatus.Name != "Avoided" && event.EventCycleStatus.Name != "Canceled" && event.EventCycleStatus.Name != "Executed" {
							evicted = true
							break
						}
						retCode, _, _, err := r.RunCommandByAliyunAssiant(ctx, "uptime", r.hostNameToInstanceId[nodeName], 20)
						logger.Info("in restartScheduledNode", "nodeName:", nodeName, "retcode:", retCode)
						if err != nil {
							logger.Info("in restartScheduledNode check instanceId unavailable", "error", err)
							evicted = true
							break
						}
						if retCode != "0" {
							logger.Info("in restartScheduledNode check instanceId unavailable")
							evicted = true
							break
						}
					}
				}
			}
			logger.Info("in restartScheduledNode", "nodeName:", nodeName, "evict:", evicted)
			if evicted {
				podList := corev1.PodList{}
				r.List(ctx, &podList)
				podFilterList := make([]corev1.Pod, 0)
				for _, pod := range podList.Items {
					if pod.Spec.NodeName == freshNode.Name && *pod.OwnerReferences[0].Controller && pod.OwnerReferences[0].Kind != "DaemonSet" {
						podFilterList = append(podFilterList, pod)
					}
				}

				if len(podFilterList) == 0 {
					logger.Info(eventIdFromNodeCondition+" has dealed evict all pods node is ", "node", freshNode)

					//	TODO 响应事件
					return
				}
				for _, pod := range podFilterList {
					var graceSecond int64 = 60
					evictPolicy := v1beta1.Eviction{
						ObjectMeta: meta.ObjectMeta{
							Name:      pod.Name,
							Namespace: pod.Namespace,
						},
						DeleteOptions: &meta.DeleteOptions{GracePeriodSeconds: &graceSecond},
					}
					err := r.OriginClient.CoreV1().Pods(pod.Namespace).Evict(ctx, &evictPolicy)
					logger.Info("in evict evict error:", "evictPolicy:", evictPolicy, "error", err)
				}
			}
		}
	}
}

// SetupWithManager sets up the controller with the Manager.
func (r *NodeReconciler) SetupWithManager(mgr ctrl.Manager) error {
	r.recorder = mgr.GetEventRecorderFor("ecs-node-controller")
	r.ecsClient, _ = ecs.NewClientWithAccessKey(r.RegionId, r.Ak, r.Sk)
	r.deleteNodeChan = make(chan string, 10)
	r.addNodeChan = make(chan string, 10)
	r.evictPodOfNodeChan = make(chan string, 10)
	r.taintChan = make(chan string, 10)
	r.revertNodeChan = make(chan string, 10)
	r.instanceCache = make(map[string]string, 100)
	r.hostNameToInstanceId = make(map[string]string)
	var err error
	r.OriginClient, err = kubernetes.NewForConfig(mgr.GetConfig())
	if err != nil {
		fmt.Println("in setup with manager setup original client err", err)
	}
	go r.syncNodeToInstnace()
	go r.syncEventFromEcsToApiServer()
	go r.markNodeTrained()
	go r.revertNodeCondition()
	go r.restartScheduledNode()
	//go r.FullyReconcile()

	return ctrl.NewControllerManagedBy(mgr).
		For(&corev1.Node{}).
		Complete(r)
}

func (r *NodeReconciler) getNodeRef(nodeName string) *corev1.ObjectReference {
	// TODO(random-liu): Get node to initialize the node reference
	return &corev1.ObjectReference{
		Kind:      "Node",
		Name:      nodeName,
		UID:       types.UID(nodeName),
		Namespace: "",
	}
}
