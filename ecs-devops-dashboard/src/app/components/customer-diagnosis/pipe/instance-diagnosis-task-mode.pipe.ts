import {Pipe, PipeTransform} from '@angular/core';
import {
  BATCH_CONCURRENCY_CONTROL_TYPE,
  BATCH_CREATE_DIAGNOSTIC_TEMP,
  BATCH_SCHEDULE_DIAGNOSTIC_TEMP,
  INVOKE_CATEGORY,
  INVOKE_MODE,
  TASK_STATUS
} from "../constants/customer-diagnosis.constants";

@Pipe({
  name: 'diagnosticMode'
})
export class InstanceDiagnosisTaskModePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if (value === BATCH_CREATE_DIAGNOSTIC_TEMP) {
      return '批量运行ECS健康诊断';
    } else if (value === BATCH_SCHEDULE_DIAGNOSTIC_TEMP) {
      return '定时运行ECS健康诊断';
    }
    return value;
  }

}


@Pipe({
  name: 'taskInvokeMode'
})
export class InstanceDiagnosisTaskInvokeModePipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return INVOKE_MODE[value] || value;
  }

}


@Pipe({
  name: 'taskStatus'
})
export class InstanceDiagnosisTaskInvokeStatusPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return TASK_STATUS[value] || value;
  }

}

@Pipe({
  name: 'taskInvokeCategory'
})
export class InstanceDiagnosisTaskInvokeCategoryPipe implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return INVOKE_CATEGORY[value] || value;
  }

}

@Pipe({
  name: 'taskBatchConcurrencyControlType'
})
export class InstanceDiagnosisTaskBatchConcurrencyControlType implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    return BATCH_CONCURRENCY_CONTROL_TYPE[value] || value;
  }

}


@Pipe({
  name: 'taskBatchControlType'
})
export class InstanceDiagnosisTaskBatchControlType implements PipeTransform {

  transform(value: string, ...args: any[]): any {
    if (value === undefined){
      return ""
    }
    if (value.indexOf("Batch") > -1) {
      return "批次控制"
    }
    return "并发控制"
  }

}
