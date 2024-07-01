import {inject, Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {catchError, EMPTY, filter, from, map, Observable, of, switchMap, tap} from 'rxjs';
import {EventStatus, GlobalConstant} from "../../../../constants/constants";
import * as moment from "moment";
import {EcsApiService} from "../../../../api/ecs-api.service";
import {Store} from "@ngrx/store";
import {selectRegionInfo} from "../../../../ngrx/selectors/global.select";
import {expand, mergeMap, reduce, takeWhile} from "rxjs/operators";

@Injectable()
export class CustomerEventEffectService extends ComponentStore<any> {

  constructor() {
    // 初始化本地状态
    super({
      tableState: {
        spinning: false,
        dataList: [],
        total: 0,
        error: null,
      },
      pieChart: {
        spinning: false,
        options: {},
        error: null
      },
      lineChart: {
        spinning: false,
        options: {},
        error: null
      },
      eventInfo: {
        value: []
      }
    })
  }

  private ecsApiService = inject(EcsApiService)

  private store = inject(Store)

  private regionInfo: any[] = []

  public loadData(params: any) {
    this.store.select(selectRegionInfo)
      .pipe(filter(value => value && value.length > 0))
      .subscribe(data => {
        this.regionInfo = data
        this.loadAllEvents(params)
      })
  }

  private loadingAll(status: boolean) {
    this.patchState({tableState: {spinning: status, dataList: [], total: 0, error: null}})
    this.patchState({
      pieChart: {
        spinning: status,
        options: {
          series: {
            data: [],
            center: ['67%', '50%'],
          }
        }, error: null
      }
    })
    this.patchState({
      lineChart: {
        spinning: status,
        options: {
          series: []
        }, error: null
      }
    })

  }

  /**
   * 查询全地域事件信息
   * @private
   */
  private readonly loadAllEvents = this.effect((ob: Observable<{
    eventType?: string[] | null,
    eventStatus?: string[] | null,
    instanceId?: string | null,
    startTime: string | null,
    endTime: string | null
  }>) => {
    return ob.pipe(
      tap(() => this.loadingAll(true)),
      switchMap(param => {
        if (param && param.instanceId) {
          return this.queryInstanceInfo(param.instanceId).pipe(
            map((res: any) => {
              return {
                ...param,
                regionId: res.RegionId
              }
            }),
            catchError((err) => {
              console.log(`query instance info error`, err)
              this.loadingAll(false)
              return EMPTY
            })
          )
        }
        return of(param)
      }),
      switchMap((param: any) => {
        const regions = this.regionInfo.map((item: any) => {
          return {RegionId: item.RegionId}
        }).filter((item: any) => {
          if (param.regionId) {
            return item.RegionId == param.regionId
          }
          return true
        })

        const allEventStatus = EventStatus.ALL_EVENT_STATUS.map(val => {
          return val.name
        })

        return from(regions).pipe(
          mergeMap((item: any) => {
            const request: any = {
              RegionId: item.RegionId,
              InstanceEventCycleStatus: param.eventStatus && param.eventStatus.length > 0 ? param.eventStatus : allEventStatus,
              InstanceEventType: param.eventType || []
            }
            if (param.instanceId) {
              request.InstanceId = param.instanceId
            }
            if (param.startTime && param.endTime) {
              request["EventPublishTime.Start"] = param.startTime
              request["EventPublishTime.End"] = param.endTime
            }
            return this.loadEvent(request)
          }),
          reduce((v1: any[], v2) => {
            v1.push(v2)
            return v1
          }, []),
          tap({
            next: value => {
              this.patchState({eventInfo: {value: value}})
              // 合并转换数据
              const res: any[] = []
              for (let i = 0; i < value.length; i++) {
                const regionData = value[i];
                for (let j = 0; j < regionData.value.length; j++) {
                  const eventData = regionData.value[j];
                  eventData.RegionId = regionData.regionId
                  res.push(eventData)
                }
              }
              res.sort((a, b) => {
                return moment(b.EventPublishTime).valueOf() - moment(a.EventPublishTime).valueOf()
              })
              this.loadTableData(res)
              this.loadPieChart(res)
              this.loadLineChart(res)
            },
            error: error => {
              console.log(error)
              this.loadingAll(false)
            }
          })
        )
      })
    )
  })

  private loadEvent(param: { RegionId: string, [key: string]: any }) {
    return this.ecsApiService.describeInstanceHistoryEvents(param).pipe(
      expand((value: any) => {
        if (value['TotalCount'] - value.PageNumber * value.pageSize > 0) {
          param['PageNumber'] = value['PageNumber'] + 1
          return this.ecsApiService.describeInstanceHistoryEvents(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((value: any) => {
        return value['TotalCount'] - value.PageNumber * value.pageSize > 0
      }, true),
      reduce((v1: [], v2: any) => {
        const value = (v2['InstanceSystemEventSet']['InstanceSystemEventType'] as []);
        v1.push(...value)
        return v1
      }, []),
      map((res) => {
        return {
          regionId: param.RegionId,
          value: res
        }
      }),
      catchError(err => {
        console.log(`query event error`, err)
        return of({
          regionId: param.RegionId,
          value: []
        })
      })
    )
  }

  private queryInstanceInfo(instanceId: string) {
    return this.ecsApiService.describeInstanceAttribute({
      RegionId: null,
      InstanceId: instanceId
    })
  }

  /**
   * 加载表格数据
   * @private
   */
  private loadTableData = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tapResponse({
        next: (value: any) => {
          this.patchState({tableState: {spinning: false, dataList: value, total: value.length, error: null}})
        },
        error: error => {
          console.log(error)
          this.patchState({tableState: {spinning: false, dataList: [], total: 0, error: null}})
        }
      })
    )
  })

  public loadPieChart = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      map(data => {
        const res: any = {}
        const totalCount = data.length
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          if (res[item.EventType.Name] == null) {
            res[item.EventType.Name] = {
              value: 0,
              name: GlobalConstant.EVENT_TYPES[item.EventType.Name] || item.EventType.Name,
              nameValue: item.EventType.Name
            }
          }
          res[item.EventType.Name].value += 1
        }
        return {
          data: Object.values(res),
          totalCount: totalCount
        }
      }),
      tapResponse({
        next: value => {
          this.patchState({
            pieChart: {
              spinning: false,
              options: {
                series: {
                  data: value.data,
                  center: ['67%', '50%'],
                },
                legend: {
                  top: Math.max((300 - 26 * value.data.length) / 2, 30)
                },
                title: {
                  text: `  {a|}  事件类型分布    共计: {b|${value.totalCount}}`,
                }
              },
              error: null
            },
          })
        },
        error: error => {
          console.log(error)
          this.patchState({
            pieChart: {
              spinning: false,
              options: {
                series: {
                  data: [],
                  center: ['67%', '50%'],
                },
                legend: {
                  top: 30
                },
                title: {
                  text: `  {a|}  事件类型分布    共计: 0`,
                }
              },
              error: null
            },
          })
        }
      })
    )
  })

  public loadLineChart = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      map(data => {
        let minTime = 0
        let maxTime = 0
        const typeData: any = {}
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const time = moment(item.EventPublishTime, 'YYYY-MM-DD HH:mm:ss').valueOf();
          if (minTime == 0) {
            minTime = time
          }
          minTime = Math.min(minTime, time)
          maxTime = Math.max(maxTime, time)
        }
        // 1天
        const interval = 3600 * 1000 * 24

        minTime = moment(minTime).startOf('day').valueOf();
        maxTime = moment(maxTime + interval).startOf('day').valueOf();

        // 保证涵盖 最大 最小 数据时间
        const completeTimes = new Array(Math.ceil((maxTime - minTime) / interval) + 1).fill(0).map((_, i) => minTime + i * interval);

        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const time = moment(item.EventPublishTime, 'YYYY-MM-DD')
          const key = `${time.format('X')}-${item.EventType.Name}`
          if (typeData[key] == null) {
            typeData[key] = {
              type: item.EventType.Name,
              time: time,
              value: 0
            }
          }
          typeData[key].value += 1
        }

        const dataByType: any = {}
        Object.values(typeData).forEach((value: any, index) => {
          if (dataByType[value.type] == null) {
            dataByType[value.type] = []
          }
          dataByType[value.type].push([value.time.valueOf(), value.value])
        })

        // 补全数据
        const completeDataByType: any = {};
        Object.keys(dataByType).forEach(type => {
          completeDataByType[type] = completeTimes.map(time => {
            const foundIndex = dataByType[type].findIndex((item: any) => item[0] === time);
            if (foundIndex !== -1) {
              return dataByType[type][foundIndex];
            } else {
              return [time, 0]; // 添加0值
            }
          });
        });

        return completeDataByType
      }),
      tapResponse({
        next: (value: any) => {
          this.patchState({
            lineChart: {
              spinning: false,
              options: {
                series: Object.keys(value).map(key => {
                  return {
                    name: GlobalConstant.EVENT_TYPES[key] || key,
                    type: 'line',
                    data: value[key],
                    symbol: "none",
                    smooth: 0.3
                  }
                }),
                xAxis: {
                  type: 'time',
                  axisLabel: {
                    formatter: (value: any) => {
                      value = moment(value).format('YYYY-MM-DD')
                      if (value) {
                        const array = value.split("-")
                        return `{time|${array[1]}/${array[2]}}\n{year|${array[0]}}`
                      }
                      return value
                    }
                  }
                },
                yAxis: {
                  type: 'value'
                }
              },
              error: null
            },
          })
        },
        error: error => {
          console.log(error)
          this.patchState({
            lineChart: {
              spinning: false,
              options: {},
              error: null
            },
          })
        }
      })
    )
  })

  /**
   * 获取本地Table状态
   */
  public getTableData = this.select(state => state.tableState);

  public chartData = this.select(
    this.select(state => state.pieChart),
    this.select(state => state.lineChart),
    (pieParam, lineParam) => ({pie: pieParam, line: lineParam})
  )

}
