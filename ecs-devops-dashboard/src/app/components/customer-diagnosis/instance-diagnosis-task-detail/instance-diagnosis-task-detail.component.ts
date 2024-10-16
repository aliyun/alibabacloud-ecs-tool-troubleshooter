import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectQueryParams} from "../../../ngrx/selectors/global.select";
import {routerLinkAction} from "../../../ngrx/actions/global.action";
import {DiagnosisEffectService} from "../service/effects/diagnosis-effect.service";
import {NavigationEnd, Router} from "@angular/router";
import * as CronParser from "cron-parser";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzDrawerService} from "ng-zorro-antd/drawer";

@Component({
  selector: 'ops-instance-diagnosis-task-detail',
  templateUrl: './instance-diagnosis-task-detail.component.html',
  styleUrls: ['./instance-diagnosis-task-detail.component.less'],
  providers: [DiagnosisEffectService]
})
export class InstanceDiagnosisTaskDetailComponent implements OnInit, OnDestroy {

  private store = inject(Store)

  private diagnosisEffectService = inject(DiagnosisEffectService)

  private nzModalService = inject(NzModalService)

  private nzNotificationService = inject(NzNotificationService)

  private nzDrawerService = inject(NzDrawerService)

  regionId = ""

  executionId = ""

  pageLoading = true

  taskInfo: any = {}

  taskReportInfo: any = {}

  allTaskData: any[] = []

  subTaskData: any[] = []

  subTaskSourceData: any[] = []

  subTaskLoading = false

  historyTaskLoading = false

  private regionInfo: any = {}

  private isFirst = true

  previewCronDates: any[] = []

  constructor(private router: Router) {
  }

  private routeSub = this.router.events.subscribe(data => {
    if (data instanceof NavigationEnd) {
      if (data.url.indexOf("task-detail") > -1 && !this.isFirst) {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.init()
      }
    }
  })

  private regionInfoSub = this.diagnosisEffectService.oosRegionData.subscribe(data => {
    const tmp: any = {}
    if (data.data) {
      for (let i = 0; i < data.data.length; i++) {
        tmp[data.data[i].RegionId] = data.data[i]
      }
    }
    this.regionInfo = tmp
  })

  subTaskCounterData: any = {}

  subTaskCounterOperation: any = [
    {
      label: "全部",
      key: "Total",
      color: "#0070cc"
    },
    {
      label: "运行中",
      key: "Running",
      color: "#0070cc"
    },
    {
      label: "成功",
      key: "Success",
      color: "#1e8e3e"
    },
    {
      label: "失败",
      key: "Failed",
      color: "#d93026"
    },
    {
      label: "未开始",
      key: "Pending",
      color: "#0070cc"
    },
    {
      label: "生效中",
      key: "Waiting",
      color: "#ffc440"
    },
    {
      label: "已取消",
      key: "Cancelled",
      color: "#0070cc"
    }
  ]

  subActiveIndex = 0

  ngOnInit(): void {
    this.init()
  }

  selectSubTaskHeaderOperation(index: number) {
    this.subActiveIndex = index
    this.filterSubTaskData()
  }

  refresh() {
    this.pageLoading = true
    this.loadDiagnosisTaskDetail()
  }

  init() {
    this.reset()
    this.diagnosisEffectService.queryOosRegionInfo()
    const subscription = this.store.select(selectQueryParams).subscribe((param: any) => {
      Promise.resolve().then(() => subscription.unsubscribe()).then(() => {
        this.executionId = param.executionId ? param.executionId.trim() : ''
        this.regionId = param.regionId ? param.regionId.trim() : '';
        if (this.executionId === "" || this.regionId === "") {
          this.back()
          return
        }
        this.loadDiagnosisTaskDetail()
      })
    })
  }

  reset() {
    this.isFirst = false
    this.regionId = ""
    this.executionId = ""
    this.pageLoading = true
    this.taskInfo = {}
    this.taskReportInfo = {}
    this.allTaskData = []
    this.subTaskData = []
    this.subTaskSourceData = []
    this.previewCronDates = []
    this.subTaskCounterData = {}
  }

  getRegionLocalName(regionId: string) {
    return this.regionInfo[regionId]?.LocalName || regionId
  }

  loadDiagnosisTaskDetail() {
    this.diagnosisEffectService.loadDiagnosisTask({
      ExecutionId: this.executionId,
      RegionId: this.regionId
    }).subscribe((data: any) => {
      if (data === null || data.Executions === null || data.Executions.length === 0) {
        this.back()
      } else {
        this.handlerTaskInfo(data.Executions[0])
      }
      this.pageLoading = false
    })
  }

  handlerTaskInfo(data: any) {
    this.taskInfo = data
    if (this.taskInfo.IsParent) {
      if (this.taskInfo.ParentExecutionId || this.taskInfo.Category === 'Other') {
        this.subTaskLoading = true
        this.subTaskList();
      } else {
        this.historyTask()
      }
    } else {
      if (this.executionId.indexOf(".") > -1) {
        // query task detail
        this.queryTaskDetail();
      } else {
        this.subTaskLoading = true
        this.subTaskList();
      }
    }
  }

  subTaskList() {
    this.diagnosisEffectService.loadTaskExecutions({
      RegionId: this.regionId,
      ExecutionId: this.executionId,
      TaskName: "createDiagnosticReports",
      MaxResults: 50
    }).subscribe((data: any) => {
      this.subTaskLoading = false
      if (data && data.TaskExecutions) {
        const temp: any[] = []
        for (let i = 0; i < data.TaskExecutions.length; i++) {
          const item = data.TaskExecutions[i];
          if (item.LoopItem === "") {
            this.subTaskCounterData = item?.Loop?.Counters || {}
          } else {
            temp.push(item)
          }
        }
        temp.sort((a, b) => {
          return (a.ChildExecutionId || 'Z').localeCompare((b.ChildExecutionId || 'Z'))
        })
        this.subTaskSourceData = temp
        this.timerRefresh()
      } else {
        this.subTaskSourceData = []
        this.subTaskCounterData = {}
      }
      this.filterSubTaskData()
    })
  }

  private timer: any

  timerRefresh() {
    const val = this.subTaskSourceData.filter(item => {
      return !(item.Status === "Success" || item.Status === "Failed" || item.Status === "Cancelled" || item.Status === "Skipped")
    })
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (val && val.length > 0) {
      this.timer = setTimeout(() => {
        this.subTaskList()
      }, 10000)
    }

  }

  getCounter(key: string): number {
    if (key === 'Running') {
      return (this.subTaskCounterData[key] || 0) + (this.subTaskCounterData['Queued'] || 0)
    }
    return this.subTaskCounterData[key] || 0
  }

  filterSubTaskData() {
    this.subTaskData = this.subTaskSourceData.filter(item => {
      return this.subActiveIndex === 0 || item.Status === this.subTaskCounterOperation[this.subActiveIndex].key
    })
  }

  queryTaskDetail() {
    if (this.taskInfo.Status === 'Cancelled') {
      this.taskReportInfo = {}
      return
    }
    this.diagnosisEffectService.loadTaskExecutions({
      ExecutionId: this.executionId,
      RegionId: this.regionId
    }).subscribe((data: any) => {
      if (data && data.TaskExecutions) {
        for (let i = 0; i < data.TaskExecutions.length; i++) {
          if (data.TaskExecutions[i].TaskName === "createDiagnosticReport") {
            try {
              const reportInfo = JSON.parse(data.TaskExecutions[i].Outputs);
              this.taskReportInfo = {
                RegionId: this.taskInfo?.Parameters?.regionId || this.regionId,
                ReportId: reportInfo.reportId
              }
            } catch (e) {
              console.log("parse report error:", e)
            }
            break;
          }
        }
      }

    })
  }

  back() {
    if (window.history.length > 2) {
      window.history.back()
      return
    } else {
      this.store.dispatch(routerLinkAction({
        commands: ["customer-diagnosis", "task-list"],
        queryParams: {
          regionId: this.regionId,
        },
        replaceUrl: true
      }))
    }
  }

  historyTask() {
    this.historyTaskLoading = true
    this.diagnosisEffectService.loadAllDiagnosisTask({
      RegionId: this.regionId,
      ParentExecutionId: this.executionId,
      MaxResults: 50
    }).subscribe(data => {
      this.allTaskData = data
      this.historyTaskLoading = false
    })
  }

  toResult(data: any) {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis", "task-detail"],
      queryParams: {
        regionId: this.regionId,
        executionId: data.ExecutionId
      }
    }))
  }

  toDetail(data: any) {
    this.store.dispatch(routerLinkAction({
      commands: ["customer-diagnosis", "task-detail"],
      queryParams: {
        regionId: this.regionId,
        executionId: data.ChildExecutionId
      }
    }))
  }

  subTaskPanelChange(data: any) {
    if (data.index == 1) {
      this.getPreviewCronDates()
    }
  }

  getPreviewCronDates() {
    if (this.taskInfo.Status === "Failed" || this.taskInfo.Status === "Success" || this.taskInfo.Status === "Cancelled") {
      this.previewCronDates = [];
      return
    }

    const cron = this.taskInfo.Parameters.timerTrigger.expression;
    const endDate = this.taskInfo.Parameters.timerTrigger.endDate;
    try {
      const interval = CronParser.parseExpression(cron);
      this.previewCronDates = [];

      let hasMore = true
      for (let i = 0; i < 5; i++) {
        const date = interval.next().toDate();
        if (date.getTime() > new Date(endDate).getTime()) {
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


  operationTask(type: string, data: any) {
    if (type === "update") {
      this.updateTask(data)
    }
    if (type === "cancel") {
      this.cancelExecutionTask(data)
    }
    if (type === "delete") {
      this.deleteExecutionTask(data)
    }
    if (type === "trigger") {
      this.triggerTask(data)
    }

  }

  triggerTask(data: any) {
    const executionId = data.ExecutionId
    this.nzModalService.confirm({
      nzTitle: '触发定时任务',
      nzContent: executionId + " 将要被立即触发，您是否确认该操作？",
      nzOnOk: () => {
        this.diagnosisEffectService.triggerExecution({
          RegionId: this.regionId,
          ExecutionId: executionId,
          Type: "Timer"
        }).subscribe(data => {
          if (data == null) {
            this.notify("error", "触发定时任务失败", "")
            return
          }
          this.notify("success", "触发定时任务成功", "定时任务" + executionId + "触发成功，将在1分钟内执行。")
          this.pageLoading = true
          setTimeout(() => {
            this.init()
          }, 1000)
        })
      }
    })
  }

  notify(type: string, title: string, content: string) {
    this.nzNotificationService.create(type, title, content);
  }

  canDelete(data: any) {
    return data.Status && (data.Status.toLowerCase() === "failed"
      || data.Status.toLowerCase() === "success"
      || data.Status.toLowerCase() === "cancelled")
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

  deleteExecutionTask(data: any) {
    this.nzModalService.confirm({
      nzTitle: '删除执行',
      nzContent: data.ExecutionId + " 将要被删除，您是否确认该操作？",
      nzOnOk: () => {
        this.diagnosisEffectService.deleteDiagnosisTask({
          RegionId: this.regionId,
          ExecutionIds: JSON.stringify([data.ExecutionId])
        }).subscribe(res => {
          if (res == null) {
            this.notify("error", "执行删除失败", "选择的执行" + data.ExecutionId + "删除失败，请重试。")
            return
          }
          this.init()
          this.notify("success", "执行删除成功", "选择的执行" + data.ExecutionId + "已删除，列表已刷新")
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
        }).subscribe(res => {
          if (res == null) {
            this.notify("error", "执行取消失败", "选择的执行" + data.ExecutionId + "取消失败，请重试。")
            return
          }
          this.init()
          this.notify("success", "执行取消成功", "选择的执行" + data.ExecutionId + "已取消，列表已刷新")
        })
      }
    })
  }

  canCancel(data: any) {
    return data.Status && data.Status.toLowerCase() !== "failed"
      && data.Status.toLowerCase() !== "success"
      && data.Status.toLowerCase() !== "cancelled"
      && data.ParentExecutionId === undefined
  }

  canUpdate(data: any) {
    // 定时任务且 未结束
    return data.Category === "TimerTrigger"
      && data.Status.toLowerCase() !== "failed"
      && data.Status.toLowerCase() !== "success"
      && data.Status.toLowerCase() !== "cancelled"
      && data.ParentExecutionId === undefined
  }

  canTrigger(data: any) {
    return data.Status === 'Waiting' && data.Category === 'TimerTrigger'
  }


  ngOnDestroy(): void {
    this.regionInfoSub.unsubscribe()
    this.routeSub.unsubscribe()
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }


}
