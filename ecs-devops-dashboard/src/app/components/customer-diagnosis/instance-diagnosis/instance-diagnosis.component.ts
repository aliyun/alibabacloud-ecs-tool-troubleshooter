import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectRegionInfo} from "../../../ngrx/selectors/global.select";
import {DiagnosisEffectService} from "../service/effects/diagnosis-effect.service";
import {DateUtils} from "../../../utils/date.utils";
import {GlobalConstant} from "../../../constants/constants";
import {Subject} from "rxjs";
import {selectCustomerDiagnoseUrlParam} from "../ngrx/selectors/consumer.diagnosis.select";
import {
  changeUrlSearchParamsAction,
  displayErrorMessage,
  displayWarningMessage,
  routerLinkAction
} from "../../../ngrx/actions/global.action";
import {BATCH_CREATE_DIAGNOSTIC_TEMP, BATCH_SCHEDULE_DIAGNOSTIC_TEMP} from "../constants/customer-diagnosis.constants";

import * as CronParser from 'cron-parser'
import {NzStatus} from "ng-zorro-antd/core/types";
import {Router} from "@angular/router";

@Component({
  selector: 'ops-instance-diagnosis',
  templateUrl: './instance-diagnosis.component.html',
  styleUrls: ['./instance-diagnosis.component.less'],
  providers: [DiagnosisEffectService]
})
export class InstanceDiagnosisComponent implements OnInit, OnDestroy {

  regionInfo: any[] = [];

  timeRange: Date[] = [new Date(new Date().getTime() - 48 * 60 * 60 * 1000), new Date()];

  regionId = "cn-hangzhou"

  taskRegionId = "";

  instanceVisible = false

  permissionVisible = false

  instanceDataLoading = false

  instanceData: any[] = []

  instanceSourceData: any[] = []

  instanceCloudAssistantLoading = false

  instanceCloudAssistantDataMap: any = {}

  searchInstanceInput = ""

  permissionData = {
    "Version": "1",
    "Statement": [
      {
        "Action": [
          "ecs:CreateDiagnosticReport",
          "ecs:DescribeDiagnosticReportAttributes",
          "ecs:DescribeInstances"
        ],
        "Resource": "*",
        "Effect": "Allow"
      }
    ]
  }

  diagnosisMetricSetId = "dms-instancedefault"

  disabledDate = (current: Date): boolean => {
    if (current.getMonth() > new Date().getMonth()) {
      return true;
    }
    if (current.getMonth() < new Date().getMonth()) {
      return false
    }
    return current.getDate() > new Date().getDate()
  }

  disabledCronDate = (current: Date): boolean => {
    return current.getTime() < new Date().getTime()
  }

  private store = inject(Store)

  private diagnosisEffectService = inject(DiagnosisEffectService)

  private regionSubscription = this.store.select(selectRegionInfo).subscribe((res: any) => {
    this.regionInfo = res;
  })

  private instanceCloudAssistantSub = this.diagnosisEffectService.instanceCloudAssistantData.subscribe(data => {
    this.instanceCloudAssistantLoading = data.spinning
    const tmp: any = {}
    for (let i = 0; i < data.data.length; i++) {
      const item = data.data[i];
      tmp[item.InstanceId] = item
    }
    this.instanceCloudAssistantDataMap = tmp
  })

  private instanceDataSub = this.diagnosisEffectService.instanceData.subscribe(data => {
    this.instanceDataLoading = data.spinning
    this.instanceSourceData = data.data
    this.instanceData = data.data
  })

  pageLoading = false

  pageTips = "诊断中..."

  checked = false

  indeterminate = false

  selectedInstanceIds = new Set<string>()

  modalSelectedInstanceIds = new Set<string>()

  listOfCurrentPageData: any[] = []

  private searchSubject = new Subject<string>()

  diagnosisType = "single"

  diagnosisRole = ""

  diagnosisCron = "0 0 1 ? * *"

  diagnosisCronError: NzStatus = ""

  diagnosisCronTime = DateUtils.addMonths(new Date(), 1)

  previewCronDates: any[] = []

  diagnosisTypeData: any[] = [
    {
      label: "实例诊断",
      value: "single",
      disabled: false,
      tooltip: "实例诊断只支持单实例"
    },
    {
      label: "批量实例诊断",
      value: "batch",
      disabled: false
    },
    {
      label: "定时诊断",
      value: "regular",
      disabled: false
    }
  ]

  diagnosisRateControlData: any[] = [
    {
      label: "并发控制",
      value: "Concurrency"
    },
    {
      label: "批次控制",
      value: "Batch"
    }
  ]

  formatterPercent = (value: number): string => `${value || 0} %`;
  parserPercent = (value: string): string => value.replace(' %', '');

  diagnosisRateControl: any = {
    type: "",
    Concurrency: {
      type: "value",
      value: 10,
      percent: 1
    },
    Batch: {
      realValue: [],
      value: "",
      controlModel: "Automatic",
      error: false
    }
  }

  diagnosisErrorControl = {
    type: "value",
    value: 0,
    percent: 0
  }

  diagnosisNotifyControl = {
    whetherNotify: false,
    notifyURI: "",
    notifyAt: ""
  }

  isUpdate = false

  executionId = ""

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    const subscription = this.store.select(selectCustomerDiagnoseUrlParam).subscribe((param) => {
      Promise.resolve().then(() => subscription.unsubscribe()).then(() => {
        const resourceId = param.resourceId ? param.resourceId.trim() : ''
        resourceId.split(",").forEach((item: any) => {
          if (item.trim() !== "") {
            this.selectedInstanceIds.add(item.trim())
          }
        })
        this.regionId = param.regionId ? param.regionId.trim() : 'cn-hangzhou';
        this.taskRegionId = param.regionId ? param.regionId.trim() : 'cn-hangzhou';
        this.executionId = param.executionId ? param.executionId.trim() : '';
        this.updateDiagnosisType()
        if (this.isTaskUpdate()) {
          this.initUpdate()
        }
      })
    })
  }

  initUpdate() {
    this.isUpdate = true
    this.pageTips = ""
    this.diagnosisType = "regular"
    this.pageLoading = true

    this.diagnosisEffectService.loadDiagnosisTask({
      RegionId: this.taskRegionId,
      ExecutionId: this.executionId
    }).subscribe((data: any) => {
      this.pageLoading = false
      if (data && data.Executions && data.Executions.length > 0) {
        this.initUpdateParam(data.Executions[0])
      } else {
        this.store.dispatch(displayWarningMessage({
          content: "诊断任务" + this.executionId + "不存在"
        }))
        this.backToTaskList()
      }

    })
  }

  initUpdateParam(data: any) {
    const parameters = data.Parameters
    this.selectedInstanceIds = new Set<string>()
    parameters.targets.ResourceIds.forEach((item: any) => {
      if (item.trim() !== "") {
        this.selectedInstanceIds.add(item.trim())
      }
    })
    this.regionId = parameters.regionId
    const timerTrigger = parameters.timerTrigger
    this.diagnosisCron = timerTrigger.expression || ""
    this.diagnosisCronTime = new Date(timerTrigger.endDate)
    this.diagnosisRole = parameters.OOSAssumeRole || ""
    this.diagnosisRoleBlur({})
    this.diagnosisCronBlur({})
    const rateControl = parameters.rateControl || {}
    this.diagnosisRateControl = {
      type: rateControl.Mode,
      Concurrency: {
        type: "value",
        value: 10,
        percent: 1
      },
      Batch: {
        realValue: [],
        value: "",
        controlModel: "Automatic",
        error: false
      }
    }
    if (rateControl.Mode === 'Batch') {
      this.diagnosisRateControl.Batch.realValue = rateControl.Batch
      this.diagnosisRateControl.Batch.value = rateControl.Batch
      this.diagnosisRateControl.Batch.controlModel = rateControl.BatchPauseOption
    } else if (rateControl.Mode === 'Concurrency') {
      if (rateControl.Concurrency && typeof rateControl.Concurrency === 'string' && rateControl.Concurrency.indexOf("%") > -1) {
        this.diagnosisRateControl.Concurrency = {
          type: "percent",
          value: 10,
          percent: Number(rateControl.Concurrency.replace("%", ""))
        }
      } else {
        this.diagnosisRateControl.Concurrency = {
          type: "value",
          value: rateControl.Concurrency || 1,
          percent: 1
        }
      }
    }

    this.diagnosisErrorControl = {
      type: "value",
      value: 0,
      percent: 0
    }

    if (rateControl.MaxErrors && typeof rateControl.MaxErrors === 'string' && rateControl.MaxErrors.indexOf("%") > -1) {
      this.diagnosisErrorControl = {
        type: "percent",
        value: 0,
        percent: Number(rateControl.MaxErrors.replace("%", ""))
      }
    } else {
      this.diagnosisErrorControl = {
        type: "value",
        value: rateControl.MaxErrors,
        percent: 0
      }
    }

    if (parameters.whetherNotify) {
      this.diagnosisNotifyControl = {
        whetherNotify: parameters.whetherNotify,
        notifyURI: parameters.notifyURI || "",
        notifyAt: parameters.notifyAt || ""
      }
    }
  }

  updateDiagnosisTask() {
    const params: any = {
      regionId: this.regionId,
      targets: {
        RegionId: this.regionId,
        ResourceIds: [...this.selectedInstanceIds],
        Type: "ResourceIds"
      },
      timerTrigger: {
        expression: this.diagnosisCron.trim(),
        endDate: DateUtils.toISOString(this.diagnosisCronTime),
        type: "cron",
        timeZone: "Asia/Shanghai"
      },
      OOSAssumeRole: this.diagnosisRole,
      rateControl: {
        Concurrency: 10,
        MaxErrors: 0,
        Mode: "Concurrency"
      }
    }

    if (this.diagnosisRateControl.type === "Concurrency") {
      params.rateControl = {
        Mode: "Concurrency",
        Concurrency: this.diagnosisRateControl.Concurrency.type === 'value' ? this.diagnosisRateControl.Concurrency.value : this.diagnosisRateControl.Concurrency.percent + "%"
      }
    }

    if (this.diagnosisRateControl.type === "Batch") {
      params.rateControl = {
        Mode: "Batch",
        BatchPauseOption: this.diagnosisRateControl.Batch.controlModel,
        Batch: this.diagnosisRateControl.Batch.realValue
      }
      if (this.diagnosisRateControl.Batch.realValue.length > 0) {
        params.rateControl.Batch = this.diagnosisRateControl.Batch.realValue
      }
    }
    params.rateControl.MaxErrors = this.diagnosisErrorControl.type === 'value' ? this.diagnosisErrorControl.value : this.diagnosisErrorControl.percent + "%"

    params.whetherNotify = this.diagnosisNotifyControl.whetherNotify
    if (this.diagnosisNotifyControl.whetherNotify) {
      params.notifyURI = this.diagnosisNotifyControl.notifyURI || ""
      params.notifyAt = this.diagnosisNotifyControl.notifyAt || ""
    }

    this.pageLoading = true
    this.diagnosisEffectService.updateExecution({
      RegionId: this.taskRegionId,
      ExecutionId: this.executionId,
      Parameters: JSON.stringify(params)
    }).subscribe(data => {
      this.pageLoading = false
      if (data) {
        // update success
        this.store.dispatch(routerLinkAction({
          commands: ["customer-diagnosis", "task-detail"],
          queryParams: {
            regionId: this.taskRegionId,
            executionId: this.executionId
          },
          replaceUrl: true
        }))
      } else {
        // update failed
        this.store.dispatch(displayErrorMessage({
          content: "诊断任务" + this.executionId + "更新失败"
        }))
      }
    })

  }

  backToTaskList() {
    window.history.back()
  }

  isTaskUpdate() {
    return this.router.url.indexOf("task-update") > -1
  }

  diagnosisRoleLoading = false
  diagnosisRoleChangeLoading = false

  diagnosisRoleMsg: any = {
    message: "",
    description: "",
    permission: []
  }

  diagnosisRoleChange(data: any) {
    this.diagnosisRoleChangeLoading = data !== "";
  }

  diagnosisRoleBlur(data: any) {
    this.diagnosisRole = this.diagnosisRole.trim()
    if (this.diagnosisRole === "") {
      this.diagnosisRoleMsg = {
        message: "",
        description: "",
        permission: []
      }
      return
    }

    // verify role
    this.diagnosisRoleLoading = true
    this.diagnosisEffectService.verifyDiagnosisRole({
      RegionId: this.regionId,
      TemplateName: BATCH_SCHEDULE_DIAGNOSTIC_TEMP,
      RamRole: this.diagnosisRole
    }).subscribe(data => {
      this.diagnosisRoleChangeLoading = false
      this.diagnosisRoleLoading = false
      if (data.success) {
        const missingPolicy = data.data.MissingPolicy;
        if (missingPolicy && missingPolicy.length > 0) {
          const policy: any[] = []
          for (let i = 0; i < missingPolicy.length; i++) {
            policy.concat(missingPolicy[i].Action)
          }
          this.diagnosisRoleMsg = {
            message: "您指定的角色 " + this.diagnosisRole + " 缺失以下权限:",
            description: "",
            permission: policy
          }
        } else {
          this.diagnosisRoleMsg = {
            message: "",
            description: "",
            permission: []
          }
        }
      } else {
        this.diagnosisRoleMsg = {
          message: "请检查您指定的角色 " + this.diagnosisRole + " 是否存在",
          description: "详细错误信息: " + data.data.Message,
          permission: []
        }
      }
    })
  }

  batchInputChange(data: any) {
    if (data === "") {
      this.diagnosisRateControl.Batch.error = false
      return
    }
    if (data.startsWith("[") && data.endsWith("]")) {
      data = data.slice(1, -1)
    }
    const split = data.split(",");
    const tmp: any = []
    for (let i = 0; i < split.length; i++) {
      let val = split[i].trim()
      if (val === "") {
        this.diagnosisRateControl.Batch.error = true
        return
      }
      if (val.indexOf(".") > -1) {
        this.diagnosisRateControl.Batch.error = true
        return
      }
      if (val.endsWith("%")) {
        // value 0 - 100
        val = val.slice(0, -1)
        if (!(this.isPositiveInteger(val) && Number(val) <= 100)) {
          this.diagnosisRateControl.Batch.error = true
          return;
        }
        tmp.push(val + "%")
      } else {
        if (!this.isPositiveInteger(val)) {
          this.diagnosisRateControl.Batch.error = true
          return
        }
        tmp.push(Number(val))
      }
    }
    this.diagnosisRateControl.Batch.realValue = [...tmp]

    this.diagnosisRateControl.Batch.error = false
  }

  isPositiveInteger(input: string): boolean {
    const num = Number(input);
    if (isNaN(num)) {
      return false;
    }
    return Number.isInteger(num) && num >= 0
  }


  diagnosisCronBlur(data: any) {
    const res = this.verifyCronExpression(this.diagnosisCron);
    if (!res) {
      this.store.dispatch(displayErrorMessage({
        content: "cron表达式格式不正确"
      }))
      this.diagnosisCronError = "error"
      this.previewCronDates = []
      return
    }
    this.diagnosisCronError = ""
    this.parseCorn()
  }

  verifyCronExpression(data: string) {
    try {
      const split = data.trim().split(" ");
      if (split.length !== 6) {
        return false;
      }
      CronParser.parseExpression(data);
      return true
    } catch (e) {
      return false
    }
  }

  diagnosisCronTimeChange(data: any) {
    this.diagnosisCronTime = data
    this.parseCorn()
  }

  diagnosisRateControlTypeChange(data: any) {
    this.diagnosisRateControl.type = data
  }

  parseCorn() {
    try {
      const interval = CronParser.parseExpression(this.diagnosisCron);
      this.previewCronDates = [];

      let hasMore = true
      for (let i = 0; i < 5; i++) {
        const date = interval.next().toDate();
        if (date.getTime() > this.diagnosisCronTime.getTime()) {
          hasMore = false
          break;
        }
        this.previewCronDates.push(date);
      }
      if (hasMore) {
        this.previewCronDates.push(null)
      }
    } catch (err) {
      console.error('Invalid cron expression:', err);
      this.previewCronDates = [];
    }
  }

  diagnosisTypeChange(data: any) {
    this.diagnosisType = data
    if (this.diagnosisType === 'regular') {
      this.parseCorn()
    }
  }

  searchChange(value: string) {
    this.searchInstanceInput = value
    this.searchSubject.next(value)
  }

  filterInstanceData() {
    this.searchSubject.subscribe(data => {
      this.instanceData = this.instanceSourceData.filter(item =>
        item.InstanceId.toLowerCase().includes(data.toLowerCase()) || item.InstanceName.toLowerCase().includes(data.toLowerCase()))
    })
  }

  singleDiagnosis() {
    this.diagnosisEffectService.createInstanceDiagnosticReport({
      RegionId: this.regionId,
      ResourceId: Array.of(...this.selectedInstanceIds)[0],
      StartTime: DateUtils.toISOStringWithoutMin(this.timeRange[0]),
      EndTime: DateUtils.toISOStringWithoutMin(this.timeRange[1]),
      MetricSetId: this.diagnosisMetricSetId.trim()
    }).subscribe(data => {
      this.pageLoading = false
      if (data == null) {
        console.error("createInstanceDiagnosticReport failed")
        return
      }
      this.reportDetail(data)
    })
  }

  batchDiagnosis() {
    const params: any = {
      regionId: this.regionId,
      targets: {
        RegionId: this.regionId,
        ResourceIds: [...this.selectedInstanceIds],
        Type: "ResourceIds"
      },
      rateControl: {
        Concurrency: 10,
        MaxErrors: 0,
        Mode: "Concurrency"
      }
    }
    this.startDiagnosisTask(params, BATCH_CREATE_DIAGNOSTIC_TEMP)
  }

  startDiagnosisTask(params: any, template: string) {
    if (this.diagnosisRateControl.type === "Concurrency") {
      params.rateControl = {
        Mode: "Concurrency",
        Concurrency: this.diagnosisRateControl.Concurrency.type === 'value' ? this.diagnosisRateControl.Concurrency.value : this.diagnosisRateControl.Concurrency.percent + "%"
      }
    }
    if (this.diagnosisRateControl.type === "Batch") {
      params.rateControl = {
        Mode: "Batch",
        BatchPauseOption: this.diagnosisRateControl.Batch.controlModel,
        Batch: this.diagnosisRateControl.Batch.realValue
      }
      if (this.diagnosisRateControl.Batch.realValue.length > 0) {
        params.rateControl.Batch = this.diagnosisRateControl.Batch.realValue
      }
    }
    params.rateControl.MaxErrors = this.diagnosisErrorControl.type === 'value' ? this.diagnosisErrorControl.value : this.diagnosisErrorControl.percent + "%"

    this.diagnosisEffectService.batchCreateDiagnosticReport({
      RegionId: this.regionId,
      TemplateName: template,
      Parameters: JSON.stringify(params)
    }).subscribe((data: any) => {
      this.pageLoading = false
      if (data) {
        this.store.dispatch(routerLinkAction({
          commands: ["customer-diagnosis", "task-detail"],
          queryParams: {
            regionId: this.regionId,
            executionId: data.Execution.ExecutionId
          }
        }))
      } else {
        this.store.dispatch(displayErrorMessage({
          content: "创建诊断任务失败"
        }))
      }
    })
  }

  regularDiagnosis() {
    const params: any = {
      regionId: this.regionId,
      targets: {
        RegionId: this.regionId,
        ResourceIds: [...this.selectedInstanceIds],
        Type: "ResourceIds"
      },
      timerTrigger: {
        expression: this.diagnosisCron.trim(),
        endDate: DateUtils.toISOString(this.diagnosisCronTime),
        type: "cron",
        timeZone: "Asia/Shanghai"
      },
      OOSAssumeRole: this.diagnosisRole,
      rateControl: {
        Concurrency: 10,
        MaxErrors: 0,
        Mode: "Concurrency"
      }
    }

    this.startDiagnosisTask(params, BATCH_SCHEDULE_DIAGNOSTIC_TEMP)
  }

  btnDisabled() {

    if (this.selectedInstanceIds.size === 0) {
      return true
    }

    if (this.diagnosisType === 'regular') {
      if (this.diagnosisRoleChangeLoading) {
        return true
      }
      // role verify
      if (this.diagnosisRoleLoading) {
        return true
      }
      if (this.selectedInstanceIds.size === 0) {
        return true
      }
      if (!this.verifyCronExpression(this.diagnosisCron)) {
        return true
      }
      return this.diagnosisRole.trim() === "";

    }
    return false

  }

  startDiagnosis() {
    this.pageLoading = true
    if (this.diagnosisType === 'single') {
      this.singleDiagnosis()
      return
    } else if (this.diagnosisType === 'batch') {
      this.batchDiagnosis()
    } else {
      this.regularDiagnosis()
    }
  }

  toDiagnosisMetricSet() {
    this.store.dispatch(routerLinkAction({
      commands: ["diagnostic", "metricSetManager"],
      queryParams: {
        RegionId: this.regionId
      },
      openTab: true
    }))
  }

  reportDetail(reportId: string) {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis", "detail"],
      queryParams: {
        regionId: this.regionId,
        reportId: reportId
      }
    }))
  }

  historyDiagnosisList() {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis", "list"],
      queryParams: {
        regionId: this.regionId
      }
    }))
  }

  historyDiagnosisTaskList() {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis", "task-list"],
      queryParams: {
        regionId: this.regionId
      }
    }))
  }

  deleteInstance(instanceId: string) {
    this.selectedInstanceIds.delete(instanceId)
    this.updateDiagnosisType()
  }

  onAllChecked(checked: any) {
    this.listOfCurrentPageData
      .filter((item: any) => !this.canSelected(item))
      .forEach(({InstanceId}) => this.updateCheckedSet(InstanceId, checked));
    this.refreshCheckedStatus();
  }

  onItemChecked(instanceId: string, checked: boolean) {
    this.updateCheckedSet(instanceId, checked)
    this.refreshCheckedStatus()
  }

  updateCheckedSet(instanceId: string, checked: boolean) {
    if (checked) {
      this.modalSelectedInstanceIds.add(instanceId)
    } else {
      this.modalSelectedInstanceIds.delete(instanceId)
    }
  }

  onCurrentPageDataChange(data: any) {
    this.listOfCurrentPageData = data;
    this.refreshCheckedStatus()
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter((item: any) => !this.canSelected(item));
    this.checked = listOfEnabledData.every(({InstanceId}) => this.modalSelectedInstanceIds.has(InstanceId));
    this.indeterminate = listOfEnabledData.some(({InstanceId}) => this.modalSelectedInstanceIds.has(InstanceId)) && !this.checked;
  }

  canSelected(data: any) {
    // status Running  can select
    if (data.Status !== "Running") {
      this.modalSelectedInstanceIds.delete(data.InstanceId)
    }
    // return false
    return !(data.Status === "Running")
  }

  loadInstanceInfo() {
    this.diagnosisEffectService.loadInstanceInfoWithRegion({
      RegionId: this.regionId
    })
    this.diagnosisEffectService.loadAllInstanceCloudAssistantData({
      RegionId: this.regionId
    })
  }

  regionChange(data: any) {
    this.regionId = data
    this.store.dispatch(changeUrlSearchParamsAction({
      searchParams: {
        regionId: data
      }
    }))
    this.selectedInstanceIds = new Set<string>()
  }


  openInstanceSelect() {
    this.instanceVisible = true
    // load instance list
    this.modalSelectedInstanceIds = new Set<string>(this.selectedInstanceIds)
    this.loadInstanceInfo()
    this.filterInstanceData()
  }

  cancelInstanceSelect() {
    this.instanceVisible = false
  }

  ackSelectInstance() {
    this.instanceVisible = false
    this.selectedInstanceIds = new Set<string>(this.modalSelectedInstanceIds)

    this.updateDiagnosisType()
  }

  updateDiagnosisType() {
    if (this.selectedInstanceIds.size > 1) {
      this.timeRange = [new Date(new Date().getTime() - 48 * 60 * 60 * 1000), new Date()]

      if (this.diagnosisType === "single") {
        this.diagnosisType = "batch"
        this.diagnosisTypeData.forEach(item => {
          if (item.value === "single") {
            item.disabled = true
          }
        })
      }
    } else {
      this.diagnosisTypeData.forEach(item => item.disabled = false)
    }
  }

  ngOnDestroy(): void {
    this.regionSubscription.unsubscribe()
    this.instanceCloudAssistantSub.unsubscribe()
    this.instanceDataSub.unsubscribe()
  }

  getLocalTime(date: Date | number) {
    return DateUtils.toLocalDateString(date);
  }

  getInstanceChargeTypeDesc(chargeType: string) {
    return GlobalConstant.INSTANCE_CHARGE_TYPE_MAP[chargeType] || chargeType
  }

  getCloudAssistantStatus(instanceId: string) {
    if (this.instanceCloudAssistantDataMap[instanceId]) {
      return {
        "desc": this.instanceCloudAssistantDataMap[instanceId]['CloudAssistantVersion'] !== "" ? "已安装" : "未安装",
        "status": this.instanceCloudAssistantDataMap[instanceId]['CloudAssistantStatus'] === "true" ? "success" : "error"
      }
    }
    return {
      "desc": "未知",
      "status": "error"
    }
  }
}
