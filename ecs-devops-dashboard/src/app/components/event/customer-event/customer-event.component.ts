import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventCenterConstant} from "../constants/event.center.constant";
import {DateUtils} from "../../../utils/date.utils";
import {Params} from "@angular/router";
import {Store} from '@ngrx/store';
import {CustomerEventEffectService} from '../service/effects/customer-event-effect.service';
import {selectCustomerEventUrlParam} from '../ngrx/selectors/custom.event.select';
import {changeUrlSearchParamsAction, displayWarningMessage} from 'src/app/ngrx/actions/global.action';
import {EventStatus, GlobalConstant} from 'src/app/constants/constants';
import {EChartsOption} from "echarts";
import {selectRegionInfo} from "../../../ngrx/selectors/global.select";


@Component({
  selector: 'ops-customer-event',
  templateUrl: './customer-event.component.html',
  styleUrls: ['./customer-event.component.less'],
  providers: [CustomerEventEffectService]
})
export class CustomerEventComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store,
    private customerEventEffectService: CustomerEventEffectService,
  ) {
  }

  private startTime = "";
  private endTime = "";


  public instanceId!: string;
  public eventStatus: string[] = [];
  public eventType: string[] = [];
  public currentDate: Date[] = EventCenterConstant.getDefaultSearchTime();
  public readonly tableDataObservable = this.customerEventEffectService.getTableData;

  public readonly acceptInquiredOpsCodes = Object.keys(GlobalConstant.EVENT_TYPES).map(key => {
    return {key, value: GlobalConstant.EVENT_TYPES[key]}
  });

  public readonly acceptInquiredEventStatus = EventStatus.ALL_EVENT_STATUS
  public readonly chartData = this.customerEventEffectService.chartData


  public regionFilters: any[] = []
  public eventTypeFilters: any[] = []
  public eventStatusFilters: any[] = []

  public dataFilters = {
    regionFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.RegionId),
    eventTypeFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.EventType?.Name),
    eventStatusFilter: (conditions: string[], item: any) => conditions.some(condition => condition === item.EventCycleStatus?.Name)
  }

  public regionInfoMap: any = {}
  public regionInfo: any = []
  public region = ''
  private regionSub = this.store.select(selectRegionInfo).subscribe(data => {
    this.regionInfo = data
    for (let i = 0; i < data.length; i++) {
      this.regionInfoMap[data[i].RegionId] = data[i].LocalName
    }
  })

  private dataSub = this.customerEventEffectService.getTableData.subscribe(data => {
    const eventType: any = {}
    const eventStatus: any = {}
    const region: any = {}
    for (let i = 0; i < data.dataList.length; i++) {
      const val = data.dataList[i];
      if (eventStatus[val.EventCycleStatus?.Name] == null) {
        eventStatus[val.EventCycleStatus?.Name] = {
          text: this.getEventStatusDes(val.EventCycleStatus?.Name) || val.EventCycleStatus?.Name,
          value: val.EventCycleStatus?.Name
        }
      }

      if (eventType[val.EventType?.Name] == null) {
        eventType[val.EventType?.Name] = {
          text: this.getEventTypeDes(val.EventType?.Name) || val.EventType?.Name,
          value: val.EventType?.Name
        }
      }

      if (region[val.RegionId] == null) {
        region[val.RegionId] = {
          text: this.getRegionDes(val.RegionId) || val.RegionId,
          value: val.RegionId
        }
      }
    }
    this.eventTypeFilters = Object.values(eventType)
    this.eventStatusFilters = Object.values(eventStatus)
    this.regionFilters = Object.values(region)
  })


  ngOnInit(): void {
    // 获取URL中的参数
    const subscription = this.store.select(selectCustomerEventUrlParam).subscribe(queryParams => {
      // 释放订阅资源，相当于进入页面只获取一次URL参数
      Promise.resolve().then(() => subscription.unsubscribe()).then(() => {
        this.instanceId = queryParams.instanceId;
        this.endTime = queryParams.endTime;
        this.startTime = queryParams.startTime;
        this.eventType = queryParams.eventType;
        this.eventStatus = queryParams.eventStatus;
        this.region = queryParams.regionId

        // 时间默认 1个月
        if (this.startTime && this.endTime) {
          this.currentDate = EventCenterConstant.getDefaultSearchTime(this.startTime, this.endTime);
        } else {
          this.currentDate = EventCenterConstant.getDefaultSearchTime();
        }
        this.findVmOpsEvents();
      })
    })

  }

  changeUrlParam() {
    const queryParams: Params = {
      instanceId: this.instanceId,
      eventType: this.eventType,
      eventStatus: this.eventStatus,
      endTime: '',
      startTime: '',
    };
    if (this.currentDate && this.currentDate[1] && this.currentDate[0]) {
      queryParams['endTime'] = DateUtils.toLocalDateString(new Date(this.currentDate[1]))
      queryParams['startTime'] = DateUtils.toLocalDateString(new Date(this.currentDate[0]))
    }
    this.store.dispatch(changeUrlSearchParamsAction({searchParams: queryParams}))
  }

  search() {
    this.instanceId = this.instanceId ? this.instanceId.trim() : ""
    this.findVmOpsEvents();
  }

  findVmOpsEvents() {
    this.timeOk();
    this.changeUrlParam();

    if (!this.startTime || !this.endTime) {
      this.store.dispatch(displayWarningMessage({content: '起止时间不能为空!'}));
      return;
    }

    const request: any = {
      instanceId: this.instanceId,
      eventType: this.eventType,
      eventStatus: this.eventStatus,
      regionId: this.region
    }
    // utc时间
    if (this.startTime && this.endTime) {
      request.startTime = DateUtils.toISOStringWithoutSecond(this.startTime)
      request.endTime = DateUtils.toISOStringWithoutSecond(this.endTime)
    }

    this.customerEventEffectService.loadData(request)
  }

  /**
   * 重置按钮
   */
  resetting() {
    this.eventType = [];
    this.instanceId = "";
    this.region = ""
    this.eventStatus = [];
    this.currentDate = EventCenterConstant.getDefaultSearchTime();
    this.timeOk();
  }

  timeOk() {
    if (this.currentDate.length > 0) {
      this.startTime = DateUtils.toISOStringWithoutSecond(this.currentDate[0]);
      this.endTime = DateUtils.toISOStringWithoutSecond(this.currentDate[1]);
    } else {
      this.startTime = "";
      this.endTime = "";
    }
  }

  getEventTypeDes(eventType: string) {
    return GlobalConstant.EVENT_TYPES[eventType] || eventType;
  }

  getEventStatusDes(eventStatus: string) {
    for (let i = 0; i < EventStatus.ALL_EVENT_STATUS.length; i++) {
      const status = EventStatus.ALL_EVENT_STATUS[i];
      if (status.name === eventStatus) {
        return status.desc
      }
    }
    return eventStatus;
  }

  getRegionDes(region: string) {
    return this.regionInfoMap[region] || region;
  }

  public eventPieOptions: EChartsOption = {
    title: {
      text: '  {a|}  事件类型分布',
      textStyle: {
        fontSize: 12,
        fontWeight: 500,
        rich: {
          a: {
            width: 7,
            height: 7,
            backgroundColor: '#0070CC',
            borderRadius: 5,
          },
          b: {
            fontSize: '17px',
          }
        }
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 0,
      type: 'scroll',
    },
    series: [
      {
        name: '',
        type: 'pie',
        center: ['67%', '50%'],
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        data: [],
        emphasis: {
          label: {
            show: true,
            formatter: '{c}',
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        }
      }
    ]
  };

  /**
   * 历史事件折线图
   */
  public eventLineOptions: EChartsOption = {
    title: {
      text: '{a|}  历史事件',
      textStyle: {
        fontSize: 12,
        fontWeight: 500,
        rich: {
          a: {
            width: 7,
            height: 7,
            backgroundColor: '#0070CC',
            borderRadius: 5,
          }
        }
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      icon: 'roundRect',
      right: 20,
      left: 200,
      type: 'scroll',
    },
    grid: {
      left: 10,
      top: 40,
      right: 20,
      bottom: 20,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisLabel: {
        formatter: value => {
          if (value) {
            const array = value.split("-")
            return `{time|${array[1]}/${array[2]}}\n{year|${array[0]}}`
          }
          return value
        },
        rich: {
          year: {
            color: '#a3a3a3'
          },
          time: {
            color: '#a3a3a3'
          }
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#a5a5a5"
        }
      }
    },
    yAxis: [
      {
        type: "value"
      }
    ],
    series: []
  };


  ngOnDestroy(): void {
    this.regionSub.unsubscribe()
    this.dataSub.unsubscribe()
  }
}
