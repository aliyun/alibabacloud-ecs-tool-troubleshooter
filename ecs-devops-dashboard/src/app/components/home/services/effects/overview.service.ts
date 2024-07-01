import {inject, Injectable} from '@angular/core';
import {ComponentStore, tapResponse} from '@ngrx/component-store';
import {expand, map, mergeMap, reduce, switchMap, takeWhile} from "rxjs/operators";
import {EventStatus, GlobalConstant} from "../../../../constants/constants";
import {Store} from "@ngrx/store";
import {selectRegionInfo} from "../../../../ngrx/selectors/global.select";
import {EcsApiService} from "../../../../api/ecs-api.service";
import {catchError, EMPTY, from, Observable, of, tap} from "rxjs";
import {DateUtils} from "../../../../utils/date.utils";

@Injectable()
export class OverviewService extends ComponentStore<any> {

  constructor() {
    super({
      instanceNum: {
        vmCount: 0,
        cpuCount: 0,
        spinning: false,
        error: null
      },
      runningNum: {
        spinning: false,
        value: 0,
        error: null
      },
      regionHealthStatus: {
        spinning: false,
        value: {},
        error: null
      },

      regionChart: {
        spinning: false,
        options: {},
        error: null
      },

      healthStatusChart: {
        spinning: false,
        options: {},
        error: null
      },

      eventChart: {
        spinning: false,
        options: {},
        error: null
      },

      resourceData: {
        spinning: false,
        value: [],
        error: null
      },

      images: {
        spinning: false,
        value: [],
        error: null
      },
      instanceFullStatus: {
        spinning: false,
        value: [],
        error: null
      },

      diskInfo: {
        spinning: false,
        value: [],
        error: null
      },

      regionInfo: {
        spinning: false,
        value: [],
        error: null
      },
      eventInfo: {
        spinning: false,
        value: [],
        error: null
      },
      instanceData: {
        spinning: false,
        value: [],
        error: null
      }

    })

  }

  private regionInfo: any = {}

  private store = inject(Store)

  private ecsApiService = inject(EcsApiService)

  public loadData() {
    // 先获取 region 信息
    this.store.select(selectRegionInfo).subscribe(val => {
      this.initRegionInfo(val)
      this.loadAllInstanceData()
      this.loadAllImageData()
      this.loadAllInstanceFullStatus()
      this.loadAllDisks()
      this.loadAllEvents()
    })
  }

  public initRegionInfo(val: any) {
    const regionInfoMap: any = {}
    val.forEach((item: any) => {
      regionInfoMap[item.RegionId] = item
    })
    this.regionInfo = regionInfoMap
    this.patchState({regionInfo: {spinning: false, value: regionInfoMap, error: null}})
  }

  private loadingAll() {
    this.patchState({instanceNum: {spinning: true, vmCount: 0, cpuCount: 0, error: null}})
    this.patchState({runningNum: {spinning: true, value: 0, error: null}})
    this.patchState({
      regionChart: {
        spinning: true,
        options: {
          series: {
            data: [],
            center: ['67%', '50%'],
          },
          legend: {
            top: 60
          },
          title: {
            text: `  {a|}  实例分布`,
          }
        },
        error: null
      }
    })
    this.patchState({resourceData: {spinning: true, value: [], error: null}})

    this.patchState({regionHealthStatus: {spinning: true, value: {}, error: null}})
    this.patchState({
      healthStatusChart: {
        spinning: true,
        options: {
          series: {
            data: [],
            center: ['67%', '50%'],
          },
          legend: {
            top: (300 - 26 * 6) / 2
          },
          title: {
            text: `  {a|}  健康状态`,
          }
        },
        error: null
      }
    })

    this.patchState({eventInfo: {spinning: true, value: [], error: null}})
    this.patchState({
      eventChart: {
        spinning: true,
        options: {
          series: {
            data: [],
            center: ['67%', '50%'],
          },
          legend: {
            top: (300 - 26 * 6) / 2
          },
          title: {
            text: `  {a|}  待处理事件`,
          }
        },
        error: null
      }
    })
  }


  /**
   * 查询全地域所以实例
   * @private
   */
  private readonly loadAllInstanceData = this.effect(observable => {
    return observable.pipe(
      switchMap(() => {
        this.loadingAll()
        const queryParam = Object.values(this.regionInfo).map((item: any) => {
          return {RegionId: item.RegionId}
        })
        if (queryParam.length === 0) {
          return of([])
        }
        return from(queryParam).pipe(
          mergeMap((item: any) => {
            // return item
            return this.loadInstanceData({RegionId: item.RegionId})
          }),
          reduce((v1: any[], v2) => {
            v1.push(v2)
            return v1
          }, []),
          tap({
            next: value => {
              // 原始 实例信息
              this.patchState({
                instanceData: {
                  spinning: false,
                  value: value,
                  error: null
                }
              })
              // 统计信息
              this.calculateStatisticsData(value)
              this.loadResourceData(value)
            },
            error: error => {
              console.log(error)
            }
          })
        )

      })
    )
  })

  private loadInstanceData(param: { RegionId: string, [key: string]: any }) {
    return this.ecsApiService.describeInstances(param).pipe(
      expand((value: any) => {
        if (value['NextToken']) {
          param['NextToken'] = value['NextToken']
          param['PageNumber'] = value['PageNumber'] + 1
          return this.ecsApiService.describeInstances(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((val: any) => {
        return val['NextToken'] != null
      }, true),
      reduce((v1: [], v2: any) => {
        const values = (v2['Instances']['Instance'] as []);
        v1.push(...values)
        return v1
      }, []),
      map((res) => {
        return {
          regionId: param.RegionId,
          value: res
        }
      }),
      catchError(err => {
        console.log(`query instance error`, err)
        return of({
          regionId: param.RegionId,
          value: []
        })
      })
    )
  }

  /**
   * 加载全地域镜像信息
   * @private
   */
  private readonly loadAllImageData = this.effect(observable => {
    return observable.pipe(
      switchMap(() => {
        const queryParam = Object.values(this.regionInfo).map((item: any) => {
          return {RegionId: item.RegionId}
        })
        if (queryParam.length === 0) {
          return of([])
        }
        return from(queryParam).pipe(
          mergeMap((item: any) => {
            return this.loadImages({RegionId: item.RegionId, ImageOwnerAlias: "self"})
          }),
          reduce((v1: any[], v2) => {
            v1.push(v2)
            return v1
          }, []),
          tap({
            next: value => {
              // 变更镜像信息
              this.patchState({images: {spinning: false, value: value, error: null}})
            },
            error: error => {
              console.log(error)
            }
          })
        )

      })
    )
  })

  private loadImages(param: { RegionId: string, [key: string]: any }) {
    return this.ecsApiService.describeImages(param).pipe(
      expand((value: any) => {
        if (value['TotalCount'] - value.PageNumber * value.pageSize > 0) {
          param['PageNumber'] = value['PageNumber'] + 1
          return this.ecsApiService.describeImages(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((value: any) => {
        return value['TotalCount'] - value.PageNumber * value.pageSize > 0
      }, true),
      reduce((v1: [], v2: any) => {
        const values = (v2['Images']['Image'] as []);
        v1.push(...values)
        return v1
      }, []),
      map((res) => {
        return {
          regionId: param.RegionId,
          value: res
        }
      }),
      catchError(err => {
        console.log(`query images error`, err)
        return of({
          regionId: param.RegionId,
          value: []
        })
      })
    )
  }

  private readonly loadAllInstanceFullStatus = this.effect((ob) => {
    return ob.pipe(
      switchMap(() => {
        const queryParam = Object.values(this.regionInfo).map((item: any) => {
          return {RegionId: item.RegionId}
        })
        if (queryParam.length === 0) {
          return of([])
        }
        return from(queryParam).pipe(
          mergeMap((item: any) => {
            return this.loadInstanceFullStatus({RegionId: item.RegionId})
          }),
          reduce((v1: any, v2) => {
            // v1.push(v2)
            v1[v2.regionId] = v2.value
            return v1
          }, {}),
          tap({
            next: value => {
              this.loadHealthStatusData(value)
              this.patchState({instanceFullStatus: {spinning: false, value: value, error: null}})
            },
            error: error => {
              console.log(error)
            }
          })
        )
      })
    )
  })

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


  /**
   * 查询全地域磁盘信息
   * @private
   */
  private readonly loadAllDisks = this.effect((ob) => {
    return ob.pipe(
      switchMap(() => {
        const queryParam = Object.values(this.regionInfo).map((item: any) => {
          return {RegionId: item.RegionId}
        })
        if (queryParam.length === 0) {
          return of([])
        }
        return from(queryParam).pipe(
          mergeMap((item: any) => {
            return this.loadDisks({RegionId: item.RegionId})
          }),
          reduce((v1: any[], v2) => {
            v1.push(v2)
            return v1
          }, []),
          tap({
            next: value => {
              this.patchState({diskInfo: {spinning: false, value: value, error: null}})
            },
            error: error => {
              console.log(error)
            }
          })
        )
      })
    )
  })

  private loadDisks(param: { RegionId: string, [key: string]: any }) {
    return this.ecsApiService.describeDisks(param).pipe(
      expand((value: any) => {
        if (value['TotalCount'] - value.PageNumber * value.pageSize > 0) {
          param['PageNumber'] = value['PageNumber'] + 1
          return this.ecsApiService.describeDisks(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((value: any) => {
        return value['TotalCount'] - value.PageNumber * value.pageSize > 0
      }, true),
      reduce((v1: [], v2: any) => {
        const value = (v2['Disks']['Disk'] as []);
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
        console.log(`query disks error`, err)
        return of({
          regionId: param.RegionId,
          value: []
        })
      })
    )
  }


  /**
   * 查询全地域事件信息
   * @private
   */
  private readonly loadAllEvents = this.effect((ob) => {
    return ob.pipe(
      switchMap((param) => {
        const queryParam = Object.values(this.regionInfo).map((item: any) => {
          return {RegionId: item.RegionId}
        })
        if (queryParam.length === 0) {
          return of([])
        }
        const eventStatus = EventStatus.ALL_EVENT_STATUS.map(val => {
          return val.name
        })
        return from(queryParam).pipe(
          mergeMap((item: any) => {
            return this.loadEvent({RegionId: item.RegionId, InstanceEventCycleStatus: eventStatus})
          }),
          reduce((v1: any[], v2) => {
            v1.push(v2)
            return v1
          }, []),
          tap({
            next: value => {
              this.patchState({eventInfo: {spinning: false, value: value, error: null}})
              this.eventDataEffect(value)
            },
            error: error => {
              console.log(error)
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

  /**
   * 计算 实例相关通过信息
   * @private
   */
  private readonly calculateStatisticsData = this.effect((observable: Observable<{
    regionId: string,
    value: any[]
  }[]>) => {
    return observable.pipe(
      map(val => {
        const res = {
          instanceCount: 0,
          vCpuCount: 0,
          runningCount: 0,
          regionChart: {} as any
        }
        for (let i = 0; i < val.length; i++) {
          const regionInfo = val[i]
          for (let j = 0; j < regionInfo.value.length; j++) {
            res.vCpuCount = res.vCpuCount + regionInfo.value[j].Cpu
            if (regionInfo.value[j].Status == 'Running') {
              res.runningCount++
            }
          }

          res.instanceCount = res.instanceCount + regionInfo.value.length
          // 只展示 有实例的地域
          if (regionInfo.value.length > 0) {
            const ele = this.regionInfo[regionInfo.regionId];
            res.regionChart[regionInfo.regionId] = {
              name: ele ? ele.LocalName : regionInfo.regionId,
              value: regionInfo.value.length
            }
          }
        }
        return res
      }),
      tapResponse({
        next: value => {
          this.patchState({
            instanceNum: {
              spinning: false,
              vmCount: value.instanceCount,
              cpuCount: value.vCpuCount,
              error: null
            }
          })
          this.patchState({runningNum: {spinning: false, value: value.runningCount, error: null}})
          this.patchState({
            regionChart: {
              spinning: false,
              options: {
                series: {
                  data: Object.values(value.regionChart),
                  center: ['67%', '50%'],
                },
                legend: {
                  top: Math.max(((300 - 26 * Object.values(value.regionChart).length) / 2), 30)
                },
                title: {
                  text: `  {a|}  实例分布`,
                }
              },
              error: null
            }
          })
        },
        error: error => {
          console.log(error)
          this.patchState({instanceNum: {spinning: false, vmCount: 0, cpuCount: 0, error: null}})
          this.patchState({runningNum: {spinning: false, value: 0, error: null}})
          this.patchState({
            regionChart: {
              spinning: true,
              options: {
                series: {
                  data: [],
                  center: ['67%', '50%'],
                },
                legend: {
                  top: 60
                },
                title: {
                  text: `  {a|}  实例分布`,
                }
              },
              error: null
            }
          })
        }
      })
    )
  })

  private readonly loadHealthStatusData = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      map(value => {
        const res: any = {
          healthStatusChartData: {},
          regionHealthStatus: {}
        }
        if (value) {
          for (const regionId in value) {
            const regionInfo = value[regionId]
            res.regionHealthStatus[regionId] = {}

            for (let j = 0; j < regionInfo.length; j++) {
              const healthStatus = regionInfo[j].HealthStatus

              if (res.regionHealthStatus[regionId][healthStatus.Name] == null) {
                res.regionHealthStatus[regionId][healthStatus.Name] = {
                  value: 0
                }
              }

              if (res.healthStatusChartData[healthStatus.Name] == null) {
                const name = GlobalConstant.HEALTH_STATUS_MAP[healthStatus.Name];
                res.healthStatusChartData[healthStatus.Name] = {
                  name: name ? name : healthStatus.Name,
                  nameValue: healthStatus.Name,
                  value: 0
                }
              }
              res.healthStatusChartData[healthStatus.Name].value++
              res.regionHealthStatus[regionId][healthStatus.Name].value++
            }
          }
        }
        return res
      }),
      tapResponse({
        next: (value: any) => {
          this.patchState({regionHealthStatus: {spinning: false, value: value.regionHealthStatus, error: null}})
          this.patchState({
            healthStatusChart: {
              spinning: false,
              options: {
                series: {
                  data: Object.values(value.healthStatusChartData),
                  center: ['67%', '50%'],
                },
                legend: {
                  //(300 - 26 * Object.values(value.healthStatusChartData).length) / 2
                  top: Math.max(((300 - 26 * Object.values(value.healthStatusChartData).length) / 2), 30)
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
          this.patchState({regionHealthStatus: {spinning: false, value: {}, error: null}})
          this.patchState({
            healthStatusChart: {
              spinning: false,
              options: {
                series: {
                  data: [],
                  center: ['67%', '50%'],
                },
                legend: {
                  top: (300 - 26 * 6) / 2
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

  private readonly loadResourceData = this.effect((ob: Observable<{ regionId: string, value: any[] }[]>) => {
    return ob.pipe(
      map(value => {
        const res: any[] = []
        for (let i = 0; i < value.length; i++) {
          const regionInfo = value[i];
          let runningCount = 0
          let stoppedCount = 0
          let expiresSoonCount = 0
          let recentlyCreatedCount = 0
          for (let j = 0; j < regionInfo.value.length; j++) {
            const instance = regionInfo.value[j]
            if (instance['Status'] == 'Running') {
              runningCount++
            }
            if (instance['Status'] == 'Stopped') {
              stoppedCount++
            }
            // 判断是否快过期 15 天
            if (new Date(instance['ExpiredTime']).getTime() - new Date().getTime() <= 15 * 24 * 60 * 60 * 1000) {
              expiresSoonCount++
            }
            // 判断是否新创建 7 天内
            if (new Date().getTime() - new Date(instance['CreationTime']).getTime() <= 7 * 24 * 60 * 60 * 1000) {
              recentlyCreatedCount++
            }

          }
          res.push({
            regionId: regionInfo.regionId,
            instanceCount: regionInfo.value.length,
            runningCount: runningCount,
            expiresSoonCount: expiresSoonCount,
            recentlyCreatedCount: recentlyCreatedCount,
            stoppedCount: stoppedCount
          })
        }
        res.sort((v1, v2) => {
          return v2.instanceCount - v1.instanceCount
        })
        return res
      }),
      tapResponse({
        next: value => {
          this.patchState({resourceData: {spinning: false, value: value, error: null}})
        },
        error: error => {
          console.log(error)
          this.patchState({resourceData: {spinning: false, value: [], error: null}})
        }
      })
    )
  })

  private readonly eventDataEffect = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      map(value => {
        const eventChartData: any = {}
        for (let i = 0; i < value.length; i++) {
          const item = value[i];

          for (let j = 0; j < item.value.length; j++) {
            const event = item.value[j]
            if (event.EventCycleStatus.Name == EventStatus.INQUIRING.name || event.EventCycleStatus.Name == EventStatus.SCHEDULED.name) {
              // 为处理事件
              eventChartData[event.EventType.Name] = {
                name: GlobalConstant.EVENT_TYPES[event.EventType.Name] || event.EventType.Name,
                nameValue: event.EventType.Name,
                value: 0
              }
              eventChartData[event.EventType.Name].value++
            }
          }

        }
        return {
          eventChartData: eventChartData
        }
      }),
      tapResponse({
        next: value => {
          this.patchState({
            eventChart: {
              spinning: false,
              options: {
                series: {
                  data: Object.values(value.eventChartData),
                  center: ['67%', '50%'],
                },
                legend: {
                  top: Math.max(((300 - 26 * Object.values(value.eventChartData).length) / 2), 30)
                },
                title: {
                  text: `  {a|}  待处理事件`,
                }
              },
              error: null
            }
          })
        },
        error: error => {
          console.log(error)
          this.patchState({
            eventChart: {
              spinning: false,
              options: {
                series: {
                  data: [],
                  center: ['67%', '50%'],
                },
                legend: {
                  top: (300 - 26 * 6) / 2
                },
                title: {
                  text: `  {a|}  待处理事件`,
                }
              },
              error: null
            }
          })
        }
      })
    )
  })

  public readonly statisticsData = this.select(state => {

      // impaired 数量
      const impairedNum = {
        spinning: state.regionHealthStatus.spinning,
        error: state.regionHealthStatus.error,
        value: 0
      }
      for (let i = 0; i < Object.values(state.regionHealthStatus.value).length; i++) {
        const val = Object.values(state.regionHealthStatus.value)[i] as any
        if (val && val['Impaired'] && val['Impaired']['value'] > 0) {
          impairedNum.value = impairedNum.value + val['Impaired'].value
        }
      }
      // event 数量
      const eventNum = {
        spinning: state.eventInfo.spinning,
        error: state.eventInfo.error,
        value: 0
      }
      for (let i = 0; i < state.eventInfo.value.length; i++) {
        const val = state.eventInfo.value[i]
        eventNum.value = eventNum.value + val.value.length
      }
      return {
        instanceNum: state.instanceNum,
        impairedNum: impairedNum,
        runningNum: state.runningNum,
        eventNum: eventNum
      }
    }
  )

  public readonly instanceCharts = this.select(state => {
    return {
      regionChart: state.regionChart,
      healthStatusChart: state.healthStatusChart,
      eventChart: state.eventChart
    }
  })

  public readonly regionData = this.select(state => {
    return state.regionInfo.value
  })

  public readonly resourceData = this.select(state => {
    // 处理value 添加镜像信息等
    let value: any[] = []
    // 镜像数据统计
    const regionImages: any = {}
    for (let j = 0; j < state.images.value.length; j++) {
      const item = state.images.value[j];
      regionImages[item.regionId] = item.value.length
    }
    // 磁盘数据统计
    const regionDisks: any = {}
    for (let j = 0; j < state.diskInfo.value.length; j++) {
      const item = state.diskInfo.value[j];
      regionDisks[item.regionId] = item.value.length
    }
    // 事件数据统计
    const regionEvents: any = {}
    for (let j = 0; j < state.eventInfo.value.length; j++) {
      const item = state.eventInfo.value[j];
      regionEvents[item.regionId] = item.value.length
    }
    if (state.resourceData.value && state.resourceData.value.length > 0) {
      for (let i = 0; i < state.resourceData.value.length; i++) {
        const regionInfo = state.resourceData.value[i]
        const regionHealthStatus = state.regionHealthStatus.value[regionInfo.regionId]
        let count = 0
        if (regionHealthStatus && regionHealthStatus['Impaired'] && regionHealthStatus['Impaired']['value'] > 0) {
          count = regionHealthStatus['Impaired'].value
        }
        value.push({
          expand: false,
          ...regionInfo,
          imagesCount: regionImages[regionInfo.regionId] || 0,
          impairedCount: count,
          diskCount: regionDisks[regionInfo.regionId] || 0,
          eventCount: regionEvents[regionInfo.regionId] || 0
        })
      }
    }
    // 只展示有数据的地域
    value = value.filter(item => item.instanceCount > 0 || item.imagesCount > 0 || item.diskCount > 0)
    return {
      spinning: state.resourceData.spinning || state.instanceFullStatus.spinning,
      value: value,
      error: state.resourceData.error
    }
  })

  public readonly instanceData = this.select(state => {
    const res: any = {}

    if (state.instanceData.value) {
      for (let i = 0; i < state.instanceData.value.length; i++) {
        const {regionId, value} = state.instanceData.value[i];
        const fullStatus = state.instanceFullStatus.value[regionId] || []
        const instanceStatus: any = {}
        fullStatus.forEach((item: any) => {
          instanceStatus[item.InstanceId] = {
            name: item.HealthStatus.Name,
            desc: GlobalConstant.HEALTH_STATUS_MAP[item.HealthStatus.Name] || item.HealthStatus.Name
          }
        })

        for (let j = 0; j < value.length; j++) {
          // 数据处理
          const instance = value[j];
          instance.HealthStatus = instanceStatus[instance.InstanceId] || {name: '', desc: '/'}
          instance.StatusDesc = GlobalConstant.INSTANCE_STATUS_MAP[instance.Status] || instance.Status
          instance.InstanceNetworkTypeDesc = GlobalConstant.INTERNET_TYPE_MAP[instance.InstanceNetworkType] || instance.InstanceNetworkType
          instance.CreationTimeLocal = DateUtils.toLocalDateString(instance.CreationTime)
          instance.InstanceChargeTypeDesc = GlobalConstant.INSTANCE_CHARGE_TYPE_MAP[instance.InstanceChargeType] || instance.InstanceChargeType

          // 如果超过 1GiB 按照1GiB 显示
          if (instance.Memory / 1024 > 0) {
            instance._MemoryInfo = {
              memory: instance.Memory / 1024,
              unit: 'GiB'
            }
          } else {
            instance._MemoryInfo = {
              memory: instance.Memory,
              unit: 'MiB'
            }
          }


          instance._IpAddress = []
          // eip
          if (instance.EipAddress && instance.EipAddress.IpAddress) {
            instance._IpAddress.push({
              address: instance.EipAddress.IpAddress,
              desc: "弹性"
            })
          }
          // public ip
          if (instance.PublicIpAddress && instance.PublicIpAddress.IpAddress && instance.PublicIpAddress.IpAddress.length > 0) {
            for (let l = 0; l < instance.PublicIpAddress.IpAddress.length; l++) {
              instance._IpAddress.push({
                address: instance.PublicIpAddress.IpAddress[l],
                desc: "公有"
              })
            }
          }

          // 获取主要的 内网IP
          for (let k = 0; k < instance.NetworkInterfaces.NetworkInterface.length; k++) {
            const network = instance.NetworkInterfaces.NetworkInterface[k];
            if (network.Type == 'Primary') {
              instance._IpAddress.push({
                address: network.PrimaryIpAddress,
                desc: "私有"
              })
            }
          }
        }
        res[regionId] = value
      }
    }
    return res
  })


}
