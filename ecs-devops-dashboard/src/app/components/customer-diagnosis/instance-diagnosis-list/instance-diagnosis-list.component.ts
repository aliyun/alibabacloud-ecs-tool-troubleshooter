import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectQueryParams, selectRegionInfo} from "../../../ngrx/selectors/global.select";
import {displayErrorMessage, routerLinkAction} from "../../../ngrx/actions/global.action";
import {DiagnosisEffectService} from "../service/effects/diagnosis-effect.service";
import {DateUtils} from "../../../utils/date.utils";
import {SystemUtil} from "../../../utils/utils";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {
  InstanceDiagnosisReportDetailComponent
} from "../instance-diagnosis-report-detail/instance-diagnosis-report-detail.component";

@Component({
  selector: 'ops-instance-diagnosis-list',
  templateUrl: './instance-diagnosis-list.component.html',
  styleUrls: ['./instance-diagnosis-list.component.less'],
  providers: [DiagnosisEffectService]
})
export class InstanceDiagnosisListComponent implements OnInit, OnDestroy {

  private store = inject(Store)

  private nzDrawerService = inject(NzDrawerService)

  private diagnosisEffectService = inject(DiagnosisEffectService)

  regionId = "cn-hangzhou"

  searchType = "reportId"

  searchValue = ""

  searchPlaceholder = "请输入诊断报告ID"

  nextToken = ''

  regionInfo: any = []

  tableBodyHeight = this.calculateHeight()

  moreLoading = false

  firstLoading = true

  reportStatusFilters: any = [
    {
      text: '通过',
      value: 'severity.Normal'
    },
    {
      text: '警告',
      value: 'severity.Warn'
    },
    {
      text: '严重',
      value: 'severity.Critical'
    },
    {
      text: '诊断中',
      value: 'status.InProgress'
    },
    {
      text: '诊断失败',
      value: 'status.Failed'
    }
  ]

  searchStatus = "";

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.tableBodyHeight = this.calculateHeight()
  }

  private regionSub = this.store.select(selectRegionInfo).subscribe((res: any) => {
    this.regionInfo = res;
  })

  reportList: any[] = []
  public readonly historyReportListSub = this.diagnosisEffectService.reportsData.subscribe(data => {
    this.moreLoading = data.spinning
    this.reportList = data.data?.reports
    this.nextToken = data.data?.nextToken
  })

  ngOnInit(): void {
    const subscription = this.store.select(selectQueryParams).subscribe((param: any) => {
      Promise.resolve().then(() => subscription.unsubscribe()).then(() => {
        this.searchValue = param.reportId ? param.reportId.trim() : ''
        this.regionId = param.regionId ? param.regionId.trim() : 'cn-hangzhou';
        this.search()
      })
    })
  }

  searchTypeChange(data: any) {
    if (data === "reportId") {
      this.searchPlaceholder = "请输入诊断报告ID"
    } else {
      this.searchPlaceholder = "请输入资源ID"
    }
  }

  tableQueryParams(data: any) {
    if (data.filter && data.filter.length > 0 && data.filter[0].value) {
      this.searchStatus = data.filter[0].value
    } else {
      this.searchStatus = ""
    }

    this.search()
  }

  search() {
    this.nextToken = ""
    this.firstLoading = true
    if (this.checkReportId() && this.checkResourceId()) {
      this.queryHistoryReport()
    }
  }

  calculateHeight() {
    return Math.max(0, window.innerHeight - 287) + "px"
  }

  checkResourceId() {
    if (this.searchValue.trim() === "") {
      return true;
    }
    if (this.searchType === "resourceId") {
      if (!SystemUtil.isInstanceId(this.searchValue)) {
        this.store.dispatch(displayErrorMessage({
          content: "请输入正确的资源ID"
        }))
        return false
      }
    }
    return true
  }

  checkReportId() {
    if (this.searchValue.trim() === "") {
      return true;
    }
    if (this.searchType === "reportId") {
      if (!this.searchValue.startsWith("dr-")) {
        this.store.dispatch(displayErrorMessage({
          content: "请输入正确的报告ID"
        }))
        return false
      }
    }
    return true
  }

  getMoreData() {
    this.firstLoading = false
    this.moreLoading = true
    this.queryHistoryReport()
  }

  queryHistoryReport() {
    const params: any = {
      RegionId: this.regionId,
      MaxResults: 10,
      NextToken: this.nextToken || ""
    }
    if (this.searchValue && this.searchValue.trim()) {
      if (this.searchType === "reportId") {
        params.ReportIds = [this.searchValue]
      } else if (this.searchType === "resourceId") {
        params.ResourceIds = [this.searchValue]
      }
    }
    if (this.searchStatus && this.searchStatus.trim()) {
      const split = this.searchStatus.split(".");
      if (split[0] === "status") {
        params.Status = split[1]
      } else {
        params.Severity = split[1]
      }
    }

    this.diagnosisEffectService.queryHistoryReportWithPage(params)
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

  toLocalTime(date: Date | number) {
    return DateUtils.toLocalDateString(date);
  }

  reportDetail(item: any) {
    this.nzDrawerService.create({
      nzTitle: '诊断报告',
      nzContent: InstanceDiagnosisReportDetailComponent,
      nzWidth: 1100,
      nzContentParams: {
        value: {...item, RegionId: this.regionId}
      }
    })
  }

  ngOnDestroy(): void {
    this.regionSub.unsubscribe()
    this.historyReportListSub.unsubscribe()
  }

}
