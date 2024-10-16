import {Component, inject, Input, OnInit} from '@angular/core';
import {OverviewService} from "../services/effects/overview.service";
import {EChartsOption} from "echarts";
import {DateUtils} from "../../../utils/date.utils";

@Component({
  selector: 'ops-instance-monitor',
  templateUrl: './instance-monitor.component.html',
  styleUrls: ['./instance-monitor.component.less'],
  providers: [OverviewService]
})
export class InstanceMonitorComponent implements OnInit {

  private overviewService = inject(OverviewService)

  instanceMonitorData = this.overviewService.instanceMonitorData

  private data: any = {}

  timeRange = 3600

  public baseLineOptions: EChartsOption = {
    title: {
      text: '{a|}  监控',
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

  baseLineInitOpts: any = {
    devicePixelRatio: window.devicePixelRatio,
    width: "400px",
    height: "400px"
  }

  timeRangeList: any[] = [
    {
      label: "1小时",
      value: 3600,
      period: 60
    },
    {
      label: "3小时",
      value: 3600 * 3,
      period: 60
    },
    {
      label: "6小时",
      value: 3600 * 6,
      period: 600
    },
    {
      label: "12小时",
      value: 3600 * 12,
      period: 600
    },
    {
      label: "1天",
      value: 3600 * 24,
      period: 600
    },
    {
      label: "3天",
      value: 3600 * 24 * 3,
      period: 3600
    },
    {
      label: "7天",
      value: 3600 * 24 * 7,
      period: 3600
    },
    {
      label: "14天",
      value: 3600 * 24 * 14,
      period: 3600
    }
  ]

  @Input()
  set value(value: any) {
    this.data = value
  }

  ngOnInit(): void {
    this.loadMonitorData()
  }

  getPeriod() {
    return this.timeRangeList.find(item => item.value === this.timeRange)?.period / 60 + "分钟"
  }

  timeRangeChange(data: any) {
    this.timeRange = data
    this.loadMonitorData()
  }

  loadMonitorData() {
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - this.timeRange * 1000)
    const period = this.timeRangeList.find(item => item.value === this.timeRange)?.period

    this.overviewService.loadInstanceMonitorData({
      RegionId: this.data.regionId,
      InstanceId: this.data.instanceId,
      StartTime: DateUtils.toISOStringWithoutSecond(startTime),
      EndTime: DateUtils.toISOStringWithoutSecond(endTime),
      Period: period
    })
  }

  refresh() {
    this.loadMonitorData()
  }

}
