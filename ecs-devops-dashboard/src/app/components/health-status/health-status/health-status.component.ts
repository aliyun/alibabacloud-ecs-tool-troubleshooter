import {Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {changeUrlSearchParamsAction} from "../../../ngrx/actions/global.action";
import {selectQueryParams, selectRegionInfo} from "../../../ngrx/selectors/global.select";
import {addDays, format} from "date-fns";
import {HealthStatusEffectService} from "../services/effects/health-status-effect.service";
import {GlobalConstant} from "../../../constants/constants";
import {baseHistogramChart, basePieOptions} from "../../../shared/constants/echarts.constants";

@Component({
  selector: 'ops-health-status',
  templateUrl: './health-status.component.html',
  styleUrls: ['./health-status.component.less']
})
export class HealthStatusComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store,
  ) {
  }

  protected readonly GlobalConstant = GlobalConstant;

  private destroy = inject(DestroyRef);
  private healthStatusEffectService = inject(HealthStatusEffectService)

  public region = 'cn-hangzhou';
  public dateRange = [addDays(new Date(), -7), new Date()];

  public allRegionsData: string[] = [];
  public pageIndex = 1;
  public pageSize = 10;

  public healthStatusHistogramChart = baseHistogramChart;
  public eventHealthPieChart = basePieOptions;

  public readonly pieChartData = this.healthStatusEffectService.pieChartData

  public readonly histogramChartData = this.healthStatusEffectService.histogramChartData

  public readonly healthStatusData = this.healthStatusEffectService.healthStatusData

  public instanceStatusFilter: any[] = []
  public instanceHealthStatusFilter: any[] = []
  public instanceRegionFilter: any[] = []

  private regionIdMap: any = {}

  private readonly filterSub = this.healthStatusEffectService.healthStatusData.subscribe(data => {
    const healthStatus: any = {}
    const instanceStatus: any = {}
    const region: any = {}
    for (let i = 0; i < data.dataList.length; i++) {
      const val = data.dataList[i];
      if (healthStatus[val.healthStatus] == null) {
        healthStatus[val.healthStatus] = {
          text: GlobalConstant.HEALTH_STATUS_MAP[val.healthStatus] || val.healthStatus,
          value: val.healthStatus
        }
      }

      if (instanceStatus[val.status] == null) {
        instanceStatus[val.status] = {
          text: GlobalConstant.INSTANCE_STATUS_MAP[val.status] || val.status,
          value: val.status
        }
      }

      if (region[val.regionId] == null) {
        region[val.regionId] = {
          text: this.getRegionName(val.regionId),
          value: val.regionId
        }
      }
    }
    this.instanceStatusFilter = Object.values(instanceStatus)
    this.instanceHealthStatusFilter = Object.values(healthStatus)
    this.instanceRegionFilter = Object.values(region)
  })

  public dataFilters = {
    statusFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.status),
    healthStatusFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.healthStatus),
    regionFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.regionId)
  }

  ngOnInit(): void {

    const regionSub = this.store.select(selectRegionInfo).subscribe(data => {
      this.allRegionsData = data
      for (let i = 0; i < data.length; i++) {
        this.regionIdMap[data[i].RegionId] = data[i]
      }
    })

    // 第一次进入获取参数 并渲染
    const subscription = this.store.select(selectQueryParams).subscribe(state => {
      Promise.resolve().then(() => subscription.unsubscribe()).then(() => {
        const {startTime, endTime, regionId} = state
        if (startTime && endTime) {
          this.dateRange = [new Date(startTime), new Date(endTime)];
        }
        this.region = regionId ? regionId : "cn-hangzhou";
        this.searchDetail();
      })
    })


    this.destroy.onDestroy(() => {
      regionSub.unsubscribe()
    });
  }

  reset() {
    this.region = 'cn-hangzhou';
    this.dateRange = [addDays(new Date(), -7), new Date()];
    this.searchDetail();
  }

  timeOk() {
    this.changeUrlQueryParam()
  }

  changeUrlQueryParam() {
    const queryParams = {startTime: '', endTime: '', regionId: this.region}
    if (Array.isArray(this.dateRange) && this.dateRange[0] && this.dateRange[1]) {
      queryParams.startTime = format(this.dateRange[0], "yyyy-MM-dd HH:mm:ss");
      queryParams.endTime = format(this.dateRange[1], "yyyy-MM-dd HH:mm:ss");
    }
    if (this.region && this.region.trim()) {
      queryParams.regionId = this.region.trim();
    }
    this.store.dispatch(changeUrlSearchParamsAction({searchParams: queryParams}))
  }

  search() {
    this.changeUrlQueryParam()
    this.searchDetail();
  }

  searchDetail() {
    this.healthStatusEffectService.loadData({
      RegionId: this.region,
      StartTime: this.dateRange[0].getTime(),
      EndTime: this.dateRange[1].getTime()
    })

  }

  getRegionName(regionId: string) {
    const ele = this.regionIdMap[regionId];
    return ele ? ele.LocalName : regionId;
  }

  ngOnDestroy(): void {
    this.filterSub.unsubscribe()
  }

}
