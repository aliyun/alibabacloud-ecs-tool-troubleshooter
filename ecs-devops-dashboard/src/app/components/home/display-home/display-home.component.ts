import {ChangeDetectionStrategy, Component, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {OverviewService} from "../services/effects/overview.service";
import {Store} from "@ngrx/store";
import {routerLinkAction} from "../../../ngrx/actions/global.action";
import {GlobalConstant} from "../../../constants/constants";
import {basePieOptions} from "../../../shared/constants/echarts.constants";

@Component({
  selector: 'ops-display-home',
  templateUrl: './display-home.component.html',
  styleUrls: ['./display-home.component.less'],
  providers: [OverviewService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayHomeComponent implements OnInit, OnDestroy {

  private store = inject(Store)

  private overviewService = inject(OverviewService);

  public basePieOptions = basePieOptions;

  private regionData: any = {}

  public statisticsData = this.overviewService.statisticsData
  public instanceCharts = this.overviewService.instanceCharts
  public resourceData = this.overviewService.resourceData
  public instanceData = this.overviewService.instanceData
  public regionDataSub = this.overviewService.regionData.subscribe(data => {
    this.regionData = data
  })

  // 展示全量的状态过滤
  public instanceStatusFilter: any[] = this.createDataFilter(GlobalConstant.INSTANCE_STATUS_MAP)
  public instanceHealthStatusFilter: any[] = this.createDataFilter(GlobalConstant.HEALTH_STATUS_MAP)
  public networkTypeFilter: any[] = this.createDataFilter(GlobalConstant.INTERNET_TYPE_MAP)
  public chargeTypeFilter: any[] = this.createDataFilter(GlobalConstant.INSTANCE_CHARGE_TYPE_MAP)


  // 创建一个辅助函数，用于生成实例状态过滤器对象
  private createDataFilter(statusMap: { [key: string]: string }): any[] {
    return Object.entries(statusMap).map(([key, value]) => ({
      text: value,
      value: key
    }));
  }

  public dataFilters = {
    statusFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.Status),
    healthStatusFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.HealthStatus.name),
    networkTypeFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.InstanceNetworkType),
    chargeTypeFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.InstanceChargeType)
  }

  // 嵌套表格宽度 需要动态设置
  public nestedTableWidth = this.calcNestedTableWidth()

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.nestedTableWidth = this.calcNestedTableWidth()
  }

  ngOnInit(): void {
    this.overviewService.loadData()
  }

  ngOnDestroy(): void {
    console.log(`destroy`)
    this.regionDataSub.unsubscribe()
  }

  getRegionLocalName(regionId: string) {
    if (this.regionData[regionId]) {
      return this.regionData[regionId].LocalName
    }
    return regionId
  }

  getRegionData(data: any, regionId: string) {
    if (data) {
      return data[regionId] || []
    }
    return []
  }

  getInstanceTypeUrl(instanceType: string) {
    return `https://help.aliyun.com/document_detail/25378.html#${instanceType.split('.')[1]}`
  }

  /**
   * 计算嵌套表格宽度 用于设置表格宽度不被内容撑开导致外层表格宽度发生变化
   */
  calcNestedTableWidth() {
    // 134 = all padding-left + all padding-right + border
    return (window.innerWidth - 134) + "px"
  }

  routerLink(type: string, regionId = "") {
    let path = `/`
    if (type == 'healthStatus') {
      path = `/health-status`
    } else if (type == 'event') {
      path = `/event/customerEvent`
    } else {
      return
    }
    this.store.dispatch(routerLinkAction({
      commands: [path],
      queryParams: {
        regionId: regionId
      },
      openTab: true
    }))
  }

  /**
   * 跳转到诊断界面
   * @param instanceId
   * @param regionId
   */
  toDiagnose(instanceId: string, regionId: string) {
    const diagnosePath = '/customer-diagnosis'
    this.store.dispatch(routerLinkAction({
      commands: [diagnosePath],
      queryParams: {
        resourceId: instanceId,
        regionId: regionId,
        operation: "create"
      },
      openTab: true
    }))
  }
}
