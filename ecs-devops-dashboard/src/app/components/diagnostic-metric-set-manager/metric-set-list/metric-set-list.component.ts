import {Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {MetricSetEffectService} from "../service/metric-set-effect.service";
import {Store} from "@ngrx/store";
import {selectCurrentUrlAndSearchParams, selectRegionInfo} from "../../../ngrx/selectors/global.select";
import {GlobalConstant} from "../../../constants/constants";
import {BehaviorSubject, debounceTime} from "rxjs";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {ModifyMetricSetComponent} from "../modify-metric-set/modify-metric-set.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {changeUrlSearchParamsAction, displayErrorMessage} from "../../../ngrx/actions/global.action";

@Component({
  selector: 'ops-metric-set-list',
  templateUrl: './metric-set-list.component.html',
  styleUrls: ['./metric-set-list.component.less']
})
export class MetricSetListComponent implements OnInit, OnDestroy {

  public nestedTableWidth = this.calcNestedTableWidth()

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.nestedTableWidth = this.calcNestedTableWidth()
  }

  calcNestedTableWidth() {
    // 24 * 2 * 3 + 16 * 2 + 53 + 4 =
    return (window.innerWidth - 233) + "px";
  }

  private metricSetEffectService = inject(MetricSetEffectService)

  private store = inject(Store)

  private nzDrawerService = inject(NzDrawerService)

  private nzModalService = inject(NzModalService)

  childLoading = true;
  loading = true;
  metricDataMap: any = {};

  metricSetSourceData: any[] = []
  metricSetData: any[] = []

  searchSubject = new BehaviorSubject<string>("")

  metricSetDataSub = this.metricSetEffectService.metricSetData.subscribe(data => {
    this.metricSetSourceData = data.value
    this.filterData();
    this.loading = data.spinning;
  })

  metricData = this.metricSetEffectService.metricData.subscribe(data => {
    const tmp: any = {}
    this.childLoading = data.spinning;
    for (let i = 0; i < data.value.length; i++) {
      tmp[data.value[i].MetricId] = data.value[i]
    }
    this.metricDataMap = tmp;
  })

  diagnosticMetricSetType = GlobalConstant.DIAGNOSTIC_METRIC_SET_TYPE;

  metricSetType = "Common"

  regionData = this.store.select(selectRegionInfo)

  metricSetId = ""
  regionId = "cn-hangzhou";

  private latestParams = {
    RegionId: "",
    Type: ""
  }

  ngOnInit(): void {
    const sub = this.store.select(selectCurrentUrlAndSearchParams).subscribe((data: any) => {
      Promise.resolve().then(() => sub.unsubscribe()).then(() => {
        if (data && data.searchParams) {
          this.regionId = data.searchParams.RegionId || "cn-hangzhou";
          this.metricSetType = data.searchParams.Type || "Common"
        }
        this.search()
      })
    })

    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(data => {
      this.metricSetData = this.metricSetSourceData.filter(item => {
        return item.MetricSetId.indexOf(data) > -1
      })
    })
  }

  metricSetIdChange() {
    this.searchSubject.next(this.metricSetId)
  }

  filterData() {
    // this.metricSetData = this.metricSetSourceData
    this.metricSetData = this.metricSetSourceData.filter(item => {
      return item.MetricSetId.indexOf(this.metricSetId) > -1
    })
  }

  getMetricInfo(metricId: string): any {
    if (this.metricDataMap[metricId] !== undefined) {
      return this.metricDataMap[metricId]
    }
    return {
      MetricId: metricId
    }
  }

  search() {

    // if (this.regionId === this.latestParams.RegionId && this.metricSetType === this.latestParams.Type) {
    //   this.searchSubject.next(this.metricSetId)
    //   return
    // }

    // save new params
    this.latestParams = {
      RegionId: this.regionId,
      Type: this.metricSetType
    }

    this.store.dispatch(changeUrlSearchParamsAction({searchParams: {...this.latestParams}}))
    this.load()
  }

  private load() {
    this.metricSetEffectService.loadAll(this.latestParams)
  }

  createMetricSet() {
    this.openDraw("创建诊断指标集", {
      operation: "create",
      metricIdData: Object.values(this.metricDataMap),
      regionId: this.regionId
    })
  }

  modifyMetricSet(data: any) {
    this.openDraw("修改诊断指标集", {
      operation: "modify",
      ...data,
      metricIdData: Object.values(this.metricDataMap),
      regionId: this.regionId
    })
  }

  openDraw(title: string, value: any) {
    const ref = this.nzDrawerService.create({
      nzTitle: title,
      nzContent: ModifyMetricSetComponent,
      nzWidth: '800px',
      nzMaskClosable: false,
      nzContentParams: {
        value: value
      }
    })
    ref.afterClose.subscribe(data => {
      if (data == null) {
        return
      }
      // save new params
      this.metricSetType = "User"
      this.search()
    })
  }

  tryDeleteMetricSet(data: any) {
    this.nzModalService.confirm({
      nzTitle: '确认删除吗?',
      nzContent: '诊断指标集: <b style="color: red;">' + data.MetricSetId + '</b>',
      nzOkText: '是',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteMetricSet(data),
      nzCancelText: '否',
      nzOnCancel: () => console.log('Cancel delete metricSetId')
    })
  }

  deleteMetricSet(data: any) {
    this.metricSetEffectService.deleteMetricSetId({
      RegionId: this.regionId,
      MetricSetIds: [data.MetricSetId]
    }).subscribe(res => {
      if (res == null) {
        this.store.dispatch(displayErrorMessage({
          content: "删除诊断指标集失败, 请稍后重试"
        }))
        return
      }
      this.store.dispatch(displayErrorMessage({
        content: "删除诊断指标集成功"
      }))
      this.metricSetSourceData = this.metricSetSourceData.filter(item => {
        return item.MetricSetId !== data.MetricSetId
      })
      this.filterData()
    })
  }

  ngOnDestroy(): void {
    this.metricData.unsubscribe();
    this.metricSetDataSub.unsubscribe();
    this.searchSubject.unsubscribe()
  }

}
