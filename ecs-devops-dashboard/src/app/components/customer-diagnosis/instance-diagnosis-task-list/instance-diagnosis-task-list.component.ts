import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {routerLinkAction} from "../../../ngrx/actions/global.action";
import {Store} from "@ngrx/store";
import {DiagnosisEffectService} from "../service/effects/diagnosis-effect.service";
import {
  BATCH_CREATE_DIAGNOSTIC_TEMP,
  BATCH_SCHEDULE_DIAGNOSTIC_TEMP,
  TASK_STATUS
} from "../constants/customer-diagnosis.constants";
import {NzModalService} from "ng-zorro-antd/modal";
import {selectQueryParams} from "../../../ngrx/selectors/global.select";

@Component({
  selector: 'ops-instance-diagnosis-task-list',
  templateUrl: './instance-diagnosis-task-list.component.html',
  styleUrls: ['./instance-diagnosis-task-list.component.less'],
  providers: [DiagnosisEffectService]
})
export class InstanceDiagnosisTaskListComponent implements OnInit, OnDestroy {

  private store = inject(Store)

  private diagnosisEffectService = inject(DiagnosisEffectService)

  private nzModalService = inject(NzModalService)

  tableLoading = true

  taskStatus = Object.keys(TASK_STATUS).map(key => {
    return {
      label: TASK_STATUS[key],
      value: key
    }
  })

  searchStatus = ""

  regionId = "cn-hangzhou"

  regionInfo: any[] = []

  diagnosticTaskListData: any[] = []

  nextToken = ""

  searchType = "executionId"

  private readonly searchPlaceholderMap: any = {
    executionId: "请输入执行ID",
    resourceId: "请输入资源ID",
    executionParentId: "请输入执行父ID"
  }

  searchPlaceholder = this.searchPlaceholderMap['executionId']

  searchValue = ""

  moreDataLoading = false

  private diagnosisTaskListSub = this.diagnosisEffectService.diagnosisTaskListData.subscribe(data => {
    this.moreDataLoading = data.spinning
    if (data && data.data) {
      this.diagnosticTaskListData = data.data.Executions
      this.nextToken = data.data.NextToken || ""
    } else {
      this.diagnosticTaskListData = []
      this.nextToken = ""
    }
  })

  private oosRegionSub = this.diagnosisEffectService.oosRegionData.subscribe(data => {
    this.regionInfo = data.data
  })

  operationBtn: any[] = [
    {
      label: "详情",
      isVisible: (data: any) => true,
      type: "detail",
    },
    {
      label: "修改",
      isVisible: (data: any) => this.canUpdate(data),
      type: "update"
    },
    {
      label: "取消",
      isVisible: (data: any) => this.canCancel(data),
      type: "cancel"
    },
    {
      label: "子执行",
      isVisible: (data: any) => data.IsParent,
      type: "subTask"
    },
    {
      label: "删除",
      isVisible: (data: any) => true,
      type: "delete"
    }
  ]

  taskTemplateOptions: any[] = [
    {
      label: "全部",
      value: BATCH_CREATE_DIAGNOSTIC_TEMP + "," + BATCH_SCHEDULE_DIAGNOSTIC_TEMP
    },
    {
      label: "批量运行ECS健康诊断",
      value: BATCH_CREATE_DIAGNOSTIC_TEMP
    },
    {
      label: "定时运行ECS健康诊断",
      value: BATCH_SCHEDULE_DIAGNOSTIC_TEMP
    }
  ]

  taskTemplate = BATCH_CREATE_DIAGNOSTIC_TEMP + "," + BATCH_SCHEDULE_DIAGNOSTIC_TEMP

  ngOnInit(): void {
    this.initParams()
    this.loadOosRegion()
    this.loadDiagnosisTaskList()
  }

  initParams(){
    this.store.select(selectQueryParams).subscribe((data: any)=>{
      this.regionId = data.regionId
    })
  }

  taskTemplateChange(data: any) {
    this.taskTemplate = data
    this.nextToken = ""
    this.loadDiagnosisTaskList()
  }

  searchStatusChange(data: any) {
    this.searchStatus = data
    this.nextToken = ""
    this.loadDiagnosisTaskList()
  }

  getCurrentOperationBtn(data: any): { label: string, isVisible: any, type: string }[] {
    if (data) {
      return this.operationBtn.filter(item => item.isVisible(data))
    }
    return []
  }

  getMoreData() {
    this.tableLoading = false
    this.moreDataLoading = true
    this.loadDiagnosisTaskList()
  }

  searchTypeChange(data: any) {
    this.searchPlaceholder = this.searchPlaceholderMap[data]
  }

  search() {
    this.tableLoading = true
    this.nextToken = ""
    this.loadDiagnosisTaskList()
  }

  operationTask(type: string, data: any) {
    if (type === "detail") {
      this.detailTask(data)
    }
    if (type === "update") {
      this.updateTask(data)
    }
    if (type === "cancel") {
      this.cancelExecutionTask(data)
    }
    if (type === "subTask") {
      this.querySubTask(data)
    }
    if (type === "delete") {
      this.deleteExecutionTask(data)
    }

  }

  canDelete(data: any) {
    return data.Status.toLowerCase() === "failed"
      || data.Status.toLowerCase() === "success"
      || data.Status.toLowerCase() === "cancelled"
  }

  querySubTask(data: any) {
    this.nextToken = ""
    this.searchType = "executionParentId"
    this.searchValue = data.ExecutionId
    this.tableLoading = true
    this.loadDiagnosisTaskList()
  }

  deleteExecutionTask(data: any) {
    this.nzModalService.confirm({
      nzTitle: '删除执行',
      nzContent: data.ExecutionId + " 将要被删除，您是否确认该操作？",
      nzOnOk: () => {
        this.diagnosisEffectService.deleteDiagnosisTask({
          RegionId: this.regionId,
          ExecutionIds: JSON.stringify([data.ExecutionId])
        }).subscribe(data => {
          this.loadDiagnosisTaskList()
        })
      }
    })
  }

  cancelExecutionTask(data: any) {
    this.nzModalService.confirm({
      nzTitle: '取消执行',
      nzContent: data.ExecutionId + " 将要被取消，您是否确认该操作？",
      nzOnOk: () => {
        this.diagnosisEffectService.cancelDiagnosisTask({
          RegionId: this.regionId,
          ExecutionId: data.ExecutionId
        }).subscribe(data => {
          this.loadDiagnosisTaskList()
        })
      }
    })
  }

  canCancel(data: any) {
    return data.Status.toLowerCase() !== "failed"
      && data.Status.toLowerCase() !== "success"
      && data.Status.toLowerCase() !== "cancelled"
  }

  canUpdate(data: any) {
    // 定时任务且 未结束
    return data.Category === "TimerTrigger"
      && data.Status.toLowerCase() !== "failed"
      && data.Status.toLowerCase() !== "success"
      && data.Status.toLowerCase() !== "cancelled"
  }

  detailTask(data: any) {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis", "task-detail"],
      queryParams: {
        regionId: this.regionId,
        executionId: data.ExecutionId,
      }
    }))
  }

  updateTask(data: any) {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis", "task-update"],
      queryParams: {
        regionId: this.regionId,
        executionId: data.ExecutionId
      }
    }))
  }

  loadOosRegion() {
    this.diagnosisEffectService.queryOosRegionInfo()
  }

  loadDiagnosisTaskList() {
    const params: any = {
      RegionId: this.regionId,
      TemplateName: this.taskTemplate,
      NextToken: this.nextToken || "",
      MaxResults: 20
    }
    if (this.searchStatus !== "") {
      params.Status = this.searchStatus
    }
    if (this.searchValue && this.searchValue.trim() !== "") {
      if (this.searchType === "executionId") {
        params.ExecutionId = this.searchValue.trim()
      }
      if (this.searchType === "executionParentId") {
        params.ParentExecutionId = this.searchValue.trim()
        params.TemplateName = ""
      }
      if (this.searchType === "resourceId") {
        params.ResourceId = this.searchValue.trim()
      }
    }
    this.diagnosisEffectService.queryDiagnosisTaskList(params)
  }

  backToDiagnosis() {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis"],
      queryParams: {
        regionId: this.regionId,
      },
      replaceUrl: true
    }))
  }

  ngOnDestroy(): void {
    this.diagnosisTaskListSub.unsubscribe()
    this.oosRegionSub.unsubscribe()
  }

}
