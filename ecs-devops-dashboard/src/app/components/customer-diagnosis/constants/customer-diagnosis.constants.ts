export const STATUS_MAPPER: { [key: string]: string } = {
  Submitted: '已提交',
  InProgress: '诊断中',
  RateLimit: '诊断流控',
  Finished: '诊断完成',
  Failed: '诊断失败',
}

export const BATCH_CREATE_DIAGNOSTIC_TEMP = "ACS-ECS-BulkyCreateInstanceDiagnosticReport"

export const BATCH_SCHEDULE_DIAGNOSTIC_TEMP = "ACS-ECS-ScheduleToExecuteDiagnosticReports"

export const finishedStatus = ['Finished', 'Failed', 'RateLimit']


export const TASK_STATUS: any = {
  Started: '已启动',
  Running: '执行中',
  Waiting: '生效中',
  Success: '成功',
  Failed: '失败',
  Cancelled: '已取消',
  Pending: "待执行",
}

export const INVOKE_MODE: any = {
  "Automatic": "自动执行",
  "FailurePause": "失败暂停",
  "Debug": "单步执行"
}

export const INVOKE_CATEGORY: any = {
  "Other": "主动执行",
  "TimerTrigger": "时间触发",
  "EventTrigger": "事件触发",
  "AlarmTrigger": "告警触发"
}

export const BATCH_CONCURRENCY_CONTROL_TYPE: any = {
  "Automatic": "不暂停",
  "EveryBatchPause": "每批暂停",
  "FirstBatchPause": "第一批暂停"
}

