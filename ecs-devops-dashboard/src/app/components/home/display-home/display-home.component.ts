import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import {OverviewService} from "../services/effects/overview.service";
import {Store} from "@ngrx/store";
import {displayWarningMessage, routerLinkAction} from "../../../ngrx/actions/global.action";
import {GlobalConstant} from "../../../constants/constants";
import {basePieOptions} from "../../../shared/constants/echarts.constants";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {InstanceMaintenanceAttrComponent} from "../instance-maintenance-attr/instance-maintenance-attr.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {InstanceScreenSnapshotComponent} from "../instance-screen-snapshot/instance-screen-snapshot.component";
import {InstanceConsoleOutputComponent} from "../instance-console-output/instance-console-output.component";
import {InstanceMonitorComponent} from "../instance-monitor/instance-monitor.component";

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

  private nzDrawerService = inject(NzDrawerService);

  private changeDetectorRef = inject(ChangeDetectorRef)

  private nzModalService = inject(NzModalService)

  public basePieOptions = basePieOptions;

  private regionData: any = {}

  selectedIndex = 0

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
  public instanceMaintenanceAttrFilter: any[] = GlobalConstant.INSTANCE_MAINTENANCE_ATTR_ACTION_OPTIONS.map(item => ({
    text: item.label,
    value: item.value
  }));

  regionListOfCheckedInstance: any = {}


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
    chargeTypeFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.InstanceChargeType),
    instanceMaintenanceAttrFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.MaintenanceAttr?.ActionOnMaintenance?.Value)
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
        regionId: regionId
      },
      openTab: true
    }))
  }

  getInstanceMaintenanceAttrTime(val: any) {
    if (val && val.MaintenanceWindows && val.MaintenanceWindows.MaintenanceWindow && val.MaintenanceWindows.MaintenanceWindow[0]) {
      return val.MaintenanceWindows.MaintenanceWindow[0].StartTime + ' - ' + val.MaintenanceWindows.MaintenanceWindow[0].EndTime
    }
    return "";
  }

  batchDiagnose(regionId: string) {

    const instanceIds = Object.keys(this.regionListOfCheckedInstance[regionId])
    if (!instanceIds || instanceIds.length === 0) {
      return
    }
    const diagnosePath = '/customer-diagnosis'
    this.store.dispatch(routerLinkAction({
      commands: [diagnosePath],
      queryParams: {
        resourceId: instanceIds.join(","),
        regionId: regionId
      },
      openTab: true
    }))
  }

  canModify(regionId: string) {
    const data = this.regionListOfCheckedInstance[regionId];
    return !(data && Object.keys(data).length > 1);
  }

  batchModifyInstanceMaintenanceAttr(regionId: string) {
    const instanceInfos = this.regionListOfCheckedInstance[regionId];
    if (instanceInfos == null) {
      this.store.dispatch(displayWarningMessage({
        content: '请先选择实例'
      }))
      return
    }

    this.openInstanceMaintenanceAttrDraw(Object.values(instanceInfos))
  }

  private instanceInfoMap: any = {}

  modifyInstanceMaintenanceAttr(instanceInfo: any) {
    this.openInstanceMaintenanceAttrDraw([instanceInfo])
  }

  openInstanceMaintenanceAttrDraw(instanceInfos: any[]) {
    if (instanceInfos.length > 100) {
      this.store.dispatch(displayWarningMessage({
        content: '批量修改实例维护属性不支持超过100个实例'
      }))
      return
    }
    const regionId = instanceInfos[0].RegionId

    let localDiskCount = 0
    const instanceIds: string[] = []
    for (let i = 0; i < instanceInfos.length; i++) {
      const info = instanceInfos[i]
      this.instanceInfoMap[info.InstanceId] = info
      // local disk instance +1
      if (info.LocalStorageAmount && info.LocalStorageAmount > 0) {
        localDiskCount += 1
      }
      instanceIds.push(info.InstanceId)
    }
    let maintenanceAttr = {}
    if (instanceInfos.length == 1) {
      maintenanceAttr = instanceInfos[0].MaintenanceAttr
    }

    const ref = this.nzDrawerService.create({
      nzTitle: `修改实例维护属性(${regionId})`,
      nzContent: InstanceMaintenanceAttrComponent,
      nzWidth: 700,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzContentParams: {
        value: {
          regionId: regionId,
          instanceIds: instanceIds,
          instanceMaintenanceAttr: {...maintenanceAttr},
          localDiskInstance: localDiskCount === instanceIds.length
        }
      }
    })

    ref.afterClose.subscribe((res: any) => {
      if (res && res.success) {
        // attr loading
        for (let i = 0; i < instanceIds.length; i++) {
          this.instanceInfoMap[instanceIds[i]]['MaintenanceAttr'] = {
            spinning: true
          }
        }
        this.changeDetectorRef.detectChanges()
        this.loadInstanceMaintenanceAttr(regionId, instanceIds)
      }
    })

  }

  private loadInstanceMaintenanceAttr(regionId: string, instanceIds: string[]) {
    const request = {
      PageSize: 100,
      PageNumber: 1,
      RegionId: regionId,
      InstanceId: instanceIds
    }
    this.overviewService.loadInstanceMaintenanceAttr(request).subscribe(data => {
      for (let i = 0; i < data.value.length; i++) {
        const item = data.value[i]
        item.spinning = false
        if (this.instanceInfoMap[item.InstanceId]) {
          this.instanceInfoMap[item.InstanceId]['MaintenanceAttr'] = item
        }
      }

      this.changeDetectorRef.detectChanges()
      // clear ref
      this.instanceInfoMap = {}
    })
  }

  private listOfCurrentPageData: any = {}

  private regionOfAllChecked: { [key: string]: boolean } = {}

  private regionOfIndeterminate: { [key: string]: boolean } = {}

  getRegionOfIndeterminate(regionId: string) {
    if (this.regionOfIndeterminate[regionId] != undefined) {
      return this.regionOfIndeterminate[regionId]
    }
    return false;
  }

  getRegionOfAllChecked(regionId: string) {
    if (this.regionOfAllChecked[regionId] != undefined) {
      return this.regionOfAllChecked[regionId]
    }
    return false;
  }

  onCurrentPageDataChange(regionId: string, data: readonly any[]) {
    this.listOfCurrentPageData[regionId] = data
    this.refreshStatus(regionId)
  }

  onAllChecked(regionId: string, selected: any) {
    this.regionOfAllChecked[regionId] = selected
    const data = this.listOfCurrentPageData[regionId];
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.onItemChecked(regionId, data[i], selected)
      }
    }

  }

  refreshStatus(regionId: string) {
    let currentCheckedCount = 0;
    for (let i = 0; i < this.listOfCurrentPageData[regionId].length; i++) {
      const item = this.listOfCurrentPageData[regionId][i];
      if (this.regionListOfCheckedInstance[regionId] && this.regionListOfCheckedInstance[regionId][item.InstanceId] !== undefined) {
        currentCheckedCount += 1
      }
    }

    this.regionOfAllChecked[regionId] = currentCheckedCount === this.listOfCurrentPageData[regionId].length
    this.regionOfIndeterminate[regionId] = currentCheckedCount > 0 && currentCheckedCount < this.listOfCurrentPageData[regionId].length

  }

  onItemChecked(regionId: string, data: any, selected: any) {
    if (this.regionListOfCheckedInstance[regionId] == undefined) {
      this.regionListOfCheckedInstance[regionId] = {}
    }
    if (selected) {
      this.regionListOfCheckedInstance[regionId][data.InstanceId] = data
      // check all
      this.refreshStatus(regionId)
    } else {
      delete this.regionListOfCheckedInstance[regionId][data.InstanceId]
      this.refreshStatus(regionId)
    }

  }

  itemChecked(regionId: string, data: any) {
    return !!(this.regionListOfCheckedInstance[regionId] && this.regionListOfCheckedInstance[regionId][data.InstanceId]);
  }

  tryGetInstanceScreenSnapshot(data: any) {
    this.nzModalService.confirm({
      nzTitle: `获取实例 ${data.InstanceId} 屏幕快照?`,
      nzWidth: 450,
      nzContent: `<span style="font-size: 10px; color: #e3ba3a">当实例处于休眠状态时会被强制唤醒</span>`,
      nzOnOk: () => this.openInstanceScreenSnapshot(data)
    });
  }

  openInstanceScreenSnapshot(data: any) {
    this.nzModalService.create({
      nzTitle: `实例 <b>${data.InstanceId}</b> 的屏幕截屏`,
      nzContent: InstanceScreenSnapshotComponent,
      nzWidth: 1072,
      nzCancelText: null,
      nzOkText: null,
      nzData: {
        ...data
      }
    })
  }

  tryGetInstanceConsoleOutPut(data: any) {
    this.nzModalService.create({
      nzTitle: `实例 <b>${data.InstanceId}</b> 的系统日志输出`,
      nzContent: InstanceConsoleOutputComponent,
      nzWidth: 1072,
      nzCancelText: null,
      nzOkText: null,
      nzData: {
        ...data
      }
    })
  }

  monitorDetail(data: any) {
    this.nzDrawerService.create({
      nzTitle: `<b>${data.InstanceName} </b> / <b> ${data.InstanceId} </b>`,
      nzContent: InstanceMonitorComponent,
      nzHeight: 650,
      nzPlacement: "bottom",
      nzMaskClosable: false,
      nzContentParams: {
        value: {
          regionId: data.RegionId,
          instanceId: data.InstanceId
        }
      }
    })
  }

  itemClick(data: any, event: any) {
    this.selectedIndex = 1;
    if (data) {
      data.forEach((item: any) => {
        if (item.regionId === event) {
          item.expand = true
        }
      })
    }
  }

}
