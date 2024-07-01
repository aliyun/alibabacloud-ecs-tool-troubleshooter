import {Component, OnInit} from '@angular/core';
import {addDays, format} from "date-fns";
import {DateUtils} from 'src/app/utils/date.utils';
import {NzMessageService} from "ng-zorro-antd/message";
import {SystemUtil} from "../../utils/utils";
import {Store} from "@ngrx/store";
import {changeUrlSearchParamsAction} from "../../ngrx/actions/global.action";
import {DiagnosisEffectService} from "./service/effects/diagnosis-effect.service";
import {selectCustomerDiagnoseUrlParam} from "./ngrx/selectors/consumer.diagnosis.select";
import {selectAccessKeyExists} from "../../ngrx/selectors/global.select";


@Component({
  selector: 'ops-customer-diagnosis',
  templateUrl: './customer-diagnosis.component.html',
  styleUrls: ['./customer-diagnosis.component.less'],
  providers: [DiagnosisEffectService]
})
export class CustomerDiagnosisComponent implements OnInit {

  constructor(
    private messageService: NzMessageService,
    private store: Store,
    private diagnosisEffectService: DiagnosisEffectService
  ) {
  }

  public timeRange = new Array<any>;
  public startTime = "";
  public endTime = "";
  public resourceId = "";

  private readonly mockResourceId = "i-bp19trejji1vzvjr1qq1"


  public readonly reportsData = this.diagnosisEffectService.reportsData
  public readonly loadingData = this.diagnosisEffectService.loadingData
  public showContent = false

  ngOnInit() {

    const subscription = this.store.select(selectCustomerDiagnoseUrlParam).subscribe((param) => {
      Promise.resolve().then(() => subscription.unsubscribe()).then(() => {
        this.timeRange = (param.startTime && param.endTime) ? [new Date(param.startTime), new Date(param.endTime)] : [];
        this.resourceId = param.resourceId ? param.resourceId.trim() : '';
        const regionId = param.regionId ? param.regionId.trim() : '';
        const operation = param.operation ? param.operation.trim() : '';
        if (operation == "create"){
          this.createDiagnosis()
          return;
        }
        // 存在资源id 发起查询诊断历史
        if (this.resourceId) {
          if (this.resourceId.indexOf(",") != -1 || /^dr-[a-zA-Z0-9]*/.test(this.resourceId)) {
            this.queryHistory(this.resourceId);
          }
          if (SystemUtil.isInstanceId(this.resourceId)) {
            this.queryHistory(this.resourceId);
          }
        }
      })
    })

    // static 数据初始化
    const accessKeyExistsSub = this.store.select(selectAccessKeyExists).subscribe((exists) => {
      Promise.resolve().then(() => accessKeyExistsSub.unsubscribe()).then(() => {
        if (!exists && (this.resourceId == null || this.resourceId.trim() == '')) {
          this.resourceId = this.mockResourceId
          this.queryHistory(this.resourceId)
        }
      })
    })

  }

  createDiagnosis() {
    this.resourceId = this.resourceId ? this.resourceId.trim() : ""
    if (!this.resourceId) {
      this.messageService.info("请输入资源ID");
      return;
    }
    if (this.resourceId.indexOf(",") >= 0 || !SystemUtil.isInstanceId(this.resourceId)) {
      this.messageService.info("您的输入实例 ID不合法，请检查后重新输入！");
      return;
    }

    const startTime = this.timeRange && this.timeRange[0] && this.timeRange[1] ? this.timeRange[0] : addDays(new Date(), -2);
    const endTime = this.timeRange && this.timeRange[0] && this.timeRange[1] ? this.timeRange[0] : new Date();

    const queryParams: any = {
      resourceId: this.resourceId,
      startTime: format(startTime, "yyyy-MM-dd HH:mm"),
      endTime: format(endTime, "yyyy-MM-dd HH:mm"),
      operation: ""
    }
    this.store.dispatch(changeUrlSearchParamsAction({searchParams: queryParams}))

    this.showContent = true
    this.diagnosisEffectService.createDiagnosticReport({
      instanceId: this.resourceId,
      startTime: DateUtils.toISOStringWithoutMin(startTime),
      endTime: DateUtils.toISOStringWithoutMin(endTime)
    })
  }

  queryHistory(resourceId: any) {
    this.resourceId = resourceId ? resourceId.trim() : "";
    if (!this.resourceId) {
      this.messageService.info("请输入要查询的实例ID");
      return;
    }
    if (this.resourceId.indexOf(',') > -1) {
      this.messageService.info("当前不支持查询多个实例ID");
      return;
    }

    this.showContent = true
    this.diagnosisEffectService.queryHistoryDiagnosticReport({
      instanceId: this.resourceId,
      regionId: ""
    })
  }

  onTimeChange(param: any) {
    this.timeRange = param;
    if (this.timeRange && this.timeRange.length > 2) {
      this.startTime = DateUtils.toUTCString(this.timeRange[0], 'YYYY-MM-DD[T]HH:mm[Z]');
      this.endTime = DateUtils.toUTCString(this.timeRange[1], 'YYYY-MM-DD[T]HH:mm[Z]');
    }
  }

  resourceIdChange(resourceId: any) {
    const queryParams = {
      resourceId: resourceId,
      startTime: this.timeRange[0] ? format(this.timeRange[0], "yyyy-MM-dd HH:mm") : '',
      endTime: this.timeRange[1] ? format(this.timeRange[1], "yyyy-MM-dd HH:mm") : ''
    }
    this.store.dispatch(changeUrlSearchParamsAction({searchParams: queryParams}))
  }

}
