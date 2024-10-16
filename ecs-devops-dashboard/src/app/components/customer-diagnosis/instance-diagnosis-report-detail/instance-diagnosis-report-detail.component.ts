import {Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {selectQueryParams} from "../../../ngrx/selectors/global.select";
import {Store} from "@ngrx/store";
import {DiagnosisEffectService} from "../service/effects/diagnosis-effect.service";
import {routerLinkAction} from "../../../ngrx/actions/global.action";
import {DateUtils} from "../../../utils/date.utils";

declare const window: any

@Component({
  selector: 'ops-instance-diagnosis-report-detail',
  templateUrl: './instance-diagnosis-report-detail.component.html',
  styleUrls: ['./instance-diagnosis-report-detail.component.less'],
  providers: [DiagnosisEffectService]
})
export class InstanceDiagnosisReportDetailComponent implements OnInit, OnDestroy {

  private readonly ecsDiagnoseReportComponentName = 'InstanceDiagnosticReport'

  private readonly ecsDiagnoseReportComponentId = "DiagnoseComponent_id_" + new Date().getTime() + Math.random() * 10

  @ViewChild("diagnoseReport") reportDom!: ElementRef;

  private entry: any = null

  loadingReport = true

  reportId = ""

  regionId = ""

  isRouteJump = true

  report: any = {}

  private store = inject(Store)

  private diagnosisEffectService = inject(DiagnosisEffectService)

  private reportDetailSub = this.diagnosisEffectService.reportsDetailData.subscribe(data => {
    if (data !== null && data.data !== null) {
      this.report = data.data
      this.renderComponent(data.data)
    } else {
      this.report = {}
      this.renderComponent({})
    }
  })

  @Input()
  set value(val: any) {
    if (val == undefined) {
      return
    }
    this.isRouteJump = false
    this.regionId = val.RegionId
    this.reportId = val.ReportId
    this.queryReport()
  }

  constructor() {
    // 获取诊断 entry 并挂载
    this.entry = window.__ATOM_APP_STORE__['aliyun-ecs/ecs-core']
    this.entry.mount(true)
  }

  ngOnInit(): void {
    if (this.isRouteJump) {
      const subscription = this.store.select(selectQueryParams).subscribe((param: any) => {
        Promise.resolve().then(() => subscription.unsubscribe()).then(() => {
          this.reportId = param.reportId ? param.reportId.trim() : ''
          this.regionId = param.regionId ? param.regionId.trim() : 'cn-hangzhou';
          this.queryReport()
        })
      })
    }
  }

  queryReport() {
    this.diagnosisEffectService.queryReportDetail({
      RegionId: this.regionId,
      ReportId: this.reportId
    })
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
    this.reportDetailSub.unsubscribe()
  }

  renderComponent(report: any = {}) {
    // 获取dom
    const nativeElement = this.reportDom?.nativeElement;

    if (nativeElement == null) {
      return;
    }
    const props = {
      className: 'diagnose-report',
      showCategory: true,
      regionId: "",
      report: report
    }
    const request = {
      id: this.ecsDiagnoseReportComponentId,
      name: this.ecsDiagnoseReportComponentName,
      props: props,
      portal: nativeElement
    }
    new Promise((resolve) => {
      resolve(this.entry.service.request(request))
    }).then(() => {
      if (Object.keys(report).length > 0) {
        this.loadingReport = false
      }
    })
  }

  getLocalTime(date: Date | number) {
    if (date == undefined) {
      return ""
    }
    return DateUtils.toLocalDateString(date)
  }


}
