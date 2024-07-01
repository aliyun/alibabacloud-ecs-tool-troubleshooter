import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {inject, Injectable} from "@angular/core";
import {catchError, EMPTY, from, map, Observable, of, switchMap, timer} from "rxjs";
import {EcsApiService} from "../../../../api/ecs-api.service";
import {expand, mergeMap, reduce, takeWhile} from "rxjs/operators";
import {GlobalConstant} from "../../../../constants/constants";
import {selectRegionInfo} from "../../../../ngrx/selectors/global.select";
import {Store} from "@ngrx/store";
import {CmsApiService} from "../../../../api/cms-api.service";
import {DateUtils} from "../../../../utils/date.utils";


@Injectable()
export class HealthStatusEffectService extends ComponentStore<any> {

  constructor() {
    super({
      pieChart: {
        spinning: false,
        options: {},
        error: null
      },
      histogramChart: {
        spinning: false,
        options: {},
        error: null
      },
      tableState: {
        spinning: false,
        dataList: [],
        total: 0,
        error: null,
      },
      healthStatus: {
        spinning: false,
        value: [],
        error: null
      }
    });
  }

  private ecsApiService = inject(EcsApiService)

  private cmsApiService = inject(CmsApiService)

  private store = inject(Store)

  private regionInfo: any = []

  private loadingAll(status: boolean) {
    this.patchState({
      pieChart: {
        spinning: status,
        options: {
          series: {
            data: [],
            center: ['67%', '50%'],
          },
          legend: {
            top: 60
          },
          title: {
            text: `  {a|}  健康状态`,
          }
        },
        error: null
      }
    })

    this.patchState({
      histogramChart: {
        spinning: true,
        options: {
          series: [],
          title: {
            text: "{a|}  健康状态直方图"
          }
        },
        error: null
      }
    })

    this.patchState({
      tableState: {
        spinning: status,
        dataList: [],
        total: 0,
        error: null,
      }
    })
  }

  public loadData(param: any) {
    this.store.select(selectRegionInfo).subscribe(val => {
      this.regionInfo = val
      this.loadInstanceHealthStatus(param)
      this.loadHealthStatusHistogramChart(param)
    })
  }


  /**
   * 加载实例健康状态
   */
  public loadInstanceHealthStatus = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      switchMap((param) => {
        this.loadingAll(true)
        return this.loadAllInstanceFullStatus(param)
      }),
      tapResponse({
        next: value => {
          this.patchState({
            healthStatus: {
              spinning: false,
              value: value,
              error: null
            }
          })
          // 加载饼图
          this.loadPieChart(value)
          this.loadHealthStatusData(value)
        },
        error: error => {
          console.log(error)
          this.patchState({
            healthStatus: {
              spinning: false,
              value: [],
              error: null
            }
          })
          this.loadingAll(false)
        }
      })
    )
  })

  /**
   * 加载指定regionId 的实例健康状态
   * @param param
   * @private
   */
  private loadAllInstanceFullStatus(param: { RegionId: string, [key: string]: any }) {
    const regions = this.regionInfo.map((item: any) => {
      return {RegionId: item.RegionId}
    }).filter((item: any) => {
      return param.RegionId === item.RegionId || param.RegionId === ''
    })

    if (regions.length === 0) {
      return of([])
    }

    return from(regions).pipe(
      mergeMap((item: any) => {
        return this.loadInstanceFullStatus({RegionId: item.RegionId})
      }),
      reduce((v1: any[], v2) => {
        v1.push(v2)
        return v1
      }, [])
    )
  }

  private loadInstanceFullStatus(param: { RegionId: string, [key: string]: any }) {
    return this.ecsApiService.describeInstanceFullStatus(param).pipe(
      expand((value: any) => {
        if (value['TotalCount'] - value.PageNumber * value.pageSize > 0) {
          param['PageNumber'] = value['PageNumber'] + 1
          return this.ecsApiService.describeInstanceFullStatus(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((value: any) => {
        return value['TotalCount'] - value.PageNumber * value.pageSize > 0
      }, true),
      reduce((v1: [], v2: any) => {
        const value: [] = (v2['InstanceFullStatusSet']['InstanceFullStatusType'] as []);
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
        console.log(`query full status error`, err)
        return of({
          regionId: param.RegionId,
          value: []
        })
      })
    )
  }

  public loadPieChart = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      map(value => {
        const healthStatusChartData: any = {}
        for (let i = 0; i < value.length; i++) {
          const regionInfo = value[i]

          for (let j = 0; j < regionInfo.value.length; j++) {
            const healthStatus = regionInfo.value[j].HealthStatus

            if (healthStatusChartData[healthStatus.Name] == null) {
              const name = GlobalConstant.HEALTH_STATUS_MAP[healthStatus.Name];
              healthStatusChartData[healthStatus.Name] = {
                name: name ? name : healthStatus.Name,
                nameValue: healthStatus.Name,
                value: 0
              }
            }
            healthStatusChartData[healthStatus.Name].value++
          }
        }
        return healthStatusChartData
      }),
      tapResponse({
        next: (value: any) => {
          this.patchState({
            pieChart: {
              spinning: false,
              options: {
                series: {
                  data: Object.values(value),
                  center: ['67%', '50%'],
                },
                legend: {
                  top: Math.max(((300 - 26 * Object.values(value).length) / 2), 30)
                },
                title: {
                  text: `  {a|}  健康状态`,
                }
              },
              error: null
            }
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
                  top: 60
                },
                title: {
                  text: `  {a|}  健康状态`,
                }
              },
              error: null
            }
          })
        }
      })
    )
  })

  public loadHealthStatusData = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      map(value => {
        // 转换value
        const res: any[] = []
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          for (let j = 0; j < item.value.length; j++) {
            const info = item.value[j];
            res.push({
              regionId: item.regionId,
              instanceId: info.InstanceId,
              healthStatus: info.HealthStatus.Name,
              status: info.Status.Name
            })
          }

        }
        return res
      }),
      tapResponse({
        next: (value: any) => {
          this.patchState({
            tableState: {
              spinning: false,
              dataList: value,
              total: value.length,
              error: null,
            }
          })
        },
        error: error => {
          this.patchState({
            tableState: {
              spinning: false,
              dataList: [],
              total: 0,
              error: null,
            }
          })
        }
      })
    )
  })

  public loadHealthStatusHistogramChart = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      switchMap(param => {
        return this.loadAllHealthStatusHistogram(param)
      }),
      tapResponse({
        next: value => {
          // 处理数据
          const data: any[] = []
          for (let i = 0; i < value.length; i++) {
            const items = value[i];
            items.value.forEach((item: any) => {
              data.push([
                item.StartTime,
                item.EndTime,
                item.Count
              ])
            })
          }
          // for test,  item.Count + Math.floor(Math.random() * 20) + 1

          this.patchState({
            histogramChart: {
              spinning: false,
              options: {
                tooltip: {
                  // 启用提示框
                  show: true,
                  // 自定义提示框内容
                  formatter: function (params: any) {
                    const value = params['value'];
                    const startTime = value[0];
                    const endTime = value[1];
                    const val = value[2];
                    return "起始时间: " + DateUtils.toLocalDateString(startTime) + "<br/> 结束时间: " + DateUtils.toLocalDateString(endTime) + "<br/> 数量: " + val;
                  }
                },
                xAxis: {
                  scale: true,
                  axisLabel: {
                    formatter: (value: number) => {
                      // 转换为 日期格式
                      const date = new Date(value);
                      const year = date.getFullYear();
                      const month = date.getMonth() + 1;
                      const d = date.getDate();

                      const hours = date.getHours();
                      const minutes = date.getMinutes();
                      const seconds = date.getSeconds();

                      return `${hours}:${minutes}:${seconds}\n${year}-${month}-${d}`
                    }
                  }
                },
                series: [
                  {
                    data: data
                  }
                ],
                title: {
                  text: "{a|}  健康状态直方图"
                }
              },
              error: null
            }
          })
        },
        error: error => {
          console.log(error)
        }
      })
    )
  })

  /**
   * 加载指定regionId 的实例健康状态
   * @param param
   * @private
   */
  private loadAllHealthStatusHistogram(param: { RegionId: string, [key: string]: any }) {
    const regions = this.regionInfo.map((item: any) => {
      return {RegionId: item.RegionId}
    }).filter((item: any) => {
      return param.RegionId === item.RegionId || param.RegionId === ''
    })

    if (regions.length === 0) {
      return of([])
    }

    return from(regions).pipe(
      mergeMap((item: any, index: number) => {
        const delay = index / 10
        if (delay > 0) {
          // 接口会限流 延迟请求 错峰
          return timer(delay * 500).pipe(
            mergeMap(() => {
              return this.loadHealthStatusHistogram({
                RegionId: item.RegionId,
                StartTime: param['StartTime'],
                EndTime: param['EndTime'],
                Name: "Instance:HealthStatusChange",
                Level: "INFO",
                Product: "ECS",
                EventType: "StatusNotification",
                Status: "Normal",
              })
            })
          )
        }
        return this.loadHealthStatusHistogram({RegionId: item.RegionId})
      }),
      reduce((v1: any[], v2) => {
        v1.push(v2)
        return v1
      }, [])
    )
  }

  private loadHealthStatusHistogram(param: { RegionId: string, [key: string]: any }) {
    return this.cmsApiService.describeSystemEventHistogram(param).pipe(
      map((item: any) => {
        return {
          regionId: param.RegionId,
          value: item['SystemEventHistograms']['SystemEventHistogram']
        }
      }),
      catchError(err => {
        console.log(`query health status histogram error`, err)
        return EMPTY
      })
    )
  }


  public readonly pieChartData = this.select(state => state.pieChart)

  public readonly histogramChartData = this.select(state => state.histogramChart)

  public readonly healthStatusData = this.select(state => state.tableState)


}
