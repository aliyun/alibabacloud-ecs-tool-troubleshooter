import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {inject, Injectable} from "@angular/core";
import {delay, expand, map, reduce, switchMap, takeWhile} from "rxjs/operators";
import {catchError, EMPTY, Observable, of, tap} from "rxjs";
import {finishedStatus} from "../../constants/customer-diagnosis.constants";
import {EcsApiService} from "../../../../api/ecs-api.service";
import {Store} from "@ngrx/store";
import {OosApiService} from "../../../../api/oos-api.service";


@Injectable()
export class DiagnosisEffectService extends ComponentStore<any> {
  constructor() {
    super({
      createResult: {
        spinning: false,
        data: null,
        error: null
      },
      reportDetail: {
        spinning: false,
        data: null,
        error: null
      },
      reports: {
        spinning: false,
        data: {
          nextToken: "",
          reports: []
        },
        error: null
      },
      instanceInfo: {
        spinning: false,
        data: [],
        error: null
      },
      instanceCloudAssistant: {
        spinning: false,
        data: [],
        error: null
      },
      oosRegionInfo: {
        spinning: false,
        data: [],
        error: null
      },
      instanceDiagnosisTaskList: {
        spinning: false,
        data: null,
        error: null
      }
    });
  }

  private ecsApiService = inject(EcsApiService)

  private oosApiService = inject(OosApiService)

  private store = inject(Store)

  private queryInstanceInfo(instanceId: string) {
    return this.ecsApiService.describeInstanceAttribute({
      RegionId: null,
      InstanceId: instanceId
    })
  }

  public createInstanceDiagnosticReport(param: any) {
    return this.ecsApiService.createDiagnosticReport(param).pipe(
      map((data: any) => {
        return data['ReportId']
      }),
      catchError((error: any) => {
        console.log(`create diagnose error`, error)
        return of(null)
      })
    )
  }

  public batchCreateDiagnosticReport(param: any) {
    return this.oosApiService.startExecution(param).pipe(
      map((data: any) => {
        return data
      }),
      catchError((error: any) => {
        console.log(`create batch diagnose error`, error)
        return of(null)
      })
    )
  }

  public readonly queryDiagnosisTaskList = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tap((param: any) => {
        if (param.NextToken === "") {
          this.patchState({
            instanceDiagnosisTaskList: {
              spinning: true,
              data: null,
              error: null
            }
          })
        }
      }),
      switchMap((params: any) => {
        return this.loadDiagnosisTask(params)
      }),
      tapResponse({
        next: (value: any) => {
          const lastValue = this.get(state => state.instanceDiagnosisTaskList)?.data?.Executions || []
          this.patchState({
            instanceDiagnosisTaskList: {
              spinning: false,
              data: {
                Executions: [...lastValue, ...value.Executions],
                NextToken: value.NextToken || ""
              },
              error: null
            }
          })
        },
        error: error => {
          console.log(error)
          this.patchState({
            instanceDiagnosisTaskList: {
              spinning: false,
              data: null,
              error: null
            }
          })
        }
      })
    )
  })

  public loadDiagnosisTask(params: any) {
    return this.oosApiService.listExecutions(params).pipe(catchError((err) => {
      console.log(`load diagnosis task error`, err)
      return of(null)
    }))
  }

  public loadAllDiagnosisTask(params: any) {
    return this.oosApiService.listExecutions(params).pipe(
      expand((value: any) => {
        if (value['NextToken']) {
          params['NextToken'] = value['NextToken']
          return this.loadDiagnosisTask(params)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((val: any) => {
        return val['NextToken'] != null || val['NextToken'] !== ""
      }, true),
      reduce((v1: [], v2: any) => {
        const values = (v2['Executions'] as []);
        v1.push(...values)
        return v1
      }, []),
      map((res) => {
        return res
      }),
      catchError(err => {
        console.log(`query all diagnosis task error`, err)
        return of([])
      })
    )
  }

  public loadTaskExecutions(params: any) {
    return this.oosApiService.listTaskExecutions(params).pipe(catchError((err) => {
      console.log(`load task executions error`, err)
      return of(null)
    }))
  }

  public updateExecution(params: any) {
    return this.oosApiService.updateExecution(params).pipe(
      catchError((err) => {
        console.log(`update execution error`, err)
        return of(null)
      })
    )
  }

  public readonly queryReportDetail = this.effect((ob: Observable<{
    ReportId: string,
    RegionId: string
  }>) => {
    return ob.pipe(
      tap(() => {
        this.patchState({reportDetail: {spinning: true, data: null, error: null}})
      }),
      switchMap(param => {
        return this.queryDiagnoseReportAttr(param).pipe(
          // expand 递归查询 直至报告完成
          expand((value: any) => this.reportIsFinished(value) ? EMPTY : this.queryDiagnoseReportAttr(param).pipe(delay(5000)), 1),
          takeWhile((value) => !this.reportIsFinished(value), true),
          tapResponse({
            next: value => {
              this.patchState({reportDetail: {spinning: false, data: value, error: null}})
            },
            error: error => {
              console.log(error)
              this.patchState({reportDetail: {spinning: false, data: null, error: null}})
            }
          })
        )
      })
    )
  })

  public readonly queryHistoryReportWithPage = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tap((param: any) => {
        if (param.NextToken === "") {
          this.patchState({
            reports: {
              spinning: true,
              data: {
                reports: [],
                nextToken: ""
              },
              error: null
            }
          })
        }

      }),
      switchMap((param: any) => {
        return this.ecsApiService.describeDiagnosticReports(param).pipe(catchError((err) => {
          console.log(`query history report error`, err)
          return of(null)
        }))
      }),
      tapResponse({
        next: (value: any) => {
          if (value === null) {
            this.patchState({
              reports: {
                spinning: false,
                data: {
                  nextToken: "",
                  reports: []
                },
                error: null
              }
            })
            return
          }
          const reports = this.get(state => {
            if (state.reports.data) {
              return state.reports.data.reports || []
            }
          })
          this.patchState({
            reports: {
              spinning: false,
              data: {
                reports: [...reports, ...value['Reports']['Report']],
                nextToken: value.NextToken
              },
              error: null
            }
          })
        },
        error: error => {
          console.log(error)
          this.patchState({
            reports: {
              spinning: false,
              data: {
                nextToken: "",
                reports: []
              },
              error: null
            }
          })
        }
      })
    )
  })

  public readonly loadInstanceInfoWithRegion = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tap(() => {
        this.patchState({instanceInfo: {spinning: true, data: [], error: null}})
      }),
      switchMap((param: any) => {
        param.MaxResults = 100
        return this.loadInstanceData(param)
      }),
      tapResponse({
        next: value => {
          this.patchState({instanceInfo: {spinning: false, data: value, error: null}})
        },
        error: error => {
          console.log(error)
          this.patchState({instanceInfo: {spinning: false, data: [], error: null}})
        }
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
        return val['NextToken'] != null || val['NextToken'] !== ""
      }, true),
      reduce((v1: [], v2: any) => {
        const values = (v2['Instances']['Instance'] as []);
        v1.push(...values)
        return v1
      }, []),
      map((res) => {
        return res
      }),
      catchError(err => {
        console.log(`query instance error`, err)
        return of([])
      })
    )
  }

  public loadAllInstanceCloudAssistantData = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tap(() => {
        this.patchState({instanceCloudAssistant: {spinning: true, data: [], error: null}})
      }),
      switchMap((param: any) => {
        param.MaxResults = 50
        return this.loadInstanceCloudAssistantData(param);
      }),
      tapResponse({
        next: value => {
          this.patchState({instanceCloudAssistant: {spinning: false, data: value, error: null}})
        },
        error: error => {
          console.log(error)
          this.patchState({instanceCloudAssistant: {spinning: false, data: [], error: null}})
        }
      })
    );
  })

  private loadInstanceCloudAssistantData(param: { RegionId: string, [key: string]: any }) {
    return this.ecsApiService.describeCloudAssistantStatus(param).pipe(
      expand((value: any) => {
        if (value['NextToken']) {
          param['NextToken'] = value['NextToken']
          param['PageNumber'] = value['PageNumber'] + 1
          return this.ecsApiService.describeCloudAssistantStatus(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((val: any) => {
        return val['NextToken'] != null || val['NextToken'] !== ""
      }, true),
      reduce((v1: [], v2: any) => {
        const values = (v2['InstanceCloudAssistantStatusSet']['InstanceCloudAssistantStatus'] as []);
        v1.push(...values)
        return v1
      }, []),
      map((res) => {
        return res
      }),
      catchError(err => {
        console.log(`query instance cloud assistant error`, err)
        return of([])
      })
    )
  }

  public readonly queryOosRegionInfo = this.effect((ob) => {
    return ob.pipe(
      tap(() => {
        this.patchState({oosRegionInfo: {spinning: true, data: [], error: null}})
      }),
      switchMap(() => {
        return this.loadOosRegionData();
      }),
      tapResponse({
        next: value => {
          this.patchState({oosRegionInfo: {spinning: false, data: value, error: null}})
        },
        error: error => {
          console.log(error)
          this.patchState({oosRegionInfo: {spinning: false, data: [], error: null}})
        }
      })
    );
  })

  private loadOosRegionData() {
    return this.oosApiService.describeRegions().pipe(
      map((res: any) => {
        if (Array.isArray(res.Regions)) {
          return res.Regions
        }
        return res.Regions.Region
      }),
      catchError(err => {
        console.log(`query oos region info error`, err)
        return of([])
      })
    )
  }

  public verifyDiagnosisRole(params: any) {
    return this.oosApiService.generateExecutionPolicy(params).pipe(
      map((res: any) => {
        return {
          success: true,
          data: res
        }
      }),
      catchError(err => {
        console.log(`query oos region info error`, err)
        return of({
          success: false,
          data: err.error
        })
      })
    )
  }

  public cancelDiagnosisTask(params: any) {
    return this.oosApiService.cancelExecution(params).pipe(
      catchError(err => {
        console.log(`cancel oos task info error`, err)
        return of(null)
      })
    )
  }

  public deleteDiagnosisTask(params: any) {
    return this.oosApiService.deleteExecutions(params).pipe(
      catchError(err => {
        console.log(`cancel oos task info error`, err)
        return of(null)
      })
    )
  }

  public triggerExecution(params: any) {
    return this.oosApiService.triggerExecution(params).pipe(
      catchError(err => {
        console.log(`trigger oos task info error`, err)
        return of(null)
      })
    )
  }


  private queryDiagnoseReportAttr(param: any) {
    return this.ecsApiService.describeDiagnosticReportAttributes(param)
  }

  private reportIsFinished(report: any) {
    for (let i = 0; i < finishedStatus.length; i++) {
      if (report.Status === finishedStatus[i]) {
        return true
      }
    }
    return false
  }

  public readonly diagnosisTaskListData = this.select(state => state.instanceDiagnosisTaskList)

  public readonly oosRegionData = this.select(state => state.oosRegionInfo)

  public readonly reportsData = this.select(state => state.reports)

  public readonly reportsDetailData = this.select(state => state.reportDetail)

  public readonly instanceData = this.select(state => state.instanceInfo)

  public readonly instanceCloudAssistantData = this.select(state => state.instanceCloudAssistant)
}
