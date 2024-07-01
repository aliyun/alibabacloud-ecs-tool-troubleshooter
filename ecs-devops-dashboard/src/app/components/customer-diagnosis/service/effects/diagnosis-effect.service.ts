import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {inject, Injectable} from "@angular/core";
import {delay, expand, map, mergeMap, reduce, switchMap, takeWhile} from "rxjs/operators";
import {catchError, EMPTY, from, Observable, tap} from "rxjs";
import {finishedStatus} from "../../constants/customer-diagnosis.constants";
import {EcsApiService} from "../../../../api/ecs-api.service";
import {Store} from "@ngrx/store";
import {displayWarningMessage} from "../../../../ngrx/actions/global.action";


@Injectable()
export class DiagnosisEffectService extends ComponentStore<any> {
  constructor() {
    super({
      loading: {
        desc: null,
        isLoading: false
      },
      createResult: {
        spinning: false,
        data: null,
        error: null
      },
      reports: {
        spinning: false,
        data: null,
        error: null
      }
    });
  }

  private ecsApiService = inject(EcsApiService)

  private store = inject(Store)

  private queryInstanceInfo(instanceId: string) {
    return this.ecsApiService.describeInstanceAttribute({
      RegionId: null,
      InstanceId: instanceId
    })
  }

  /**
   * 创建诊断报告
   */
  public createDiagnosticReport = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tap(val => {
        this.patchState({loading: {isLoading: true, desc: "诊断中..."}})
        this.patchState({createResult: {spinning: true, data: null, error: null}})
        this.patchState({reports: {spinning: true, data: null, error: null}})
      }),
      // 查询实例信息
      switchMap(param => {
        return this.queryInstanceInfo(param.instanceId).pipe(
          map(data => {
            return [param, data]
          }),
          catchError(() => {
            this.patchState({loading: {isLoading: false, desc: null}})
            this.patchState({createResult: {spinning: false, data: null, error: null}})
            this.patchState({reports: {spinning: false, data: null, error: null}})
            return EMPTY
          })
        )
      }),
      switchMap(([param, data]: any) => {
        const request = {
          RegionId: data.RegionId,
          ResourceId: param.instanceId,
          StartTime: param.startTime,
          EndTime: param.endTime
        }
        // 发起诊断
        return this.ecsApiService.createDiagnosticReport(request).pipe(
          tapResponse({
            next: (value: any) => {
              const res = {
                reportId: value.ReportId,
                instanceId: param.instanceId,
                regionId: data.RegionId
              }
              this.patchState({createResult: {spinning: false, data: res, error: null}})
              // 触发查询 诊断报告结果
              this.queryDiagnosticReport(res)
            },
            error: () => {
              this.patchState({loading: {isLoading: false, desc: null}})
              this.patchState({createResult: {spinning: false, data: null, error: null}})
              this.patchState({reports: {spinning: false, data: null, error: null}})
            }
          }),
          catchError(error => {
            console.log(`create diagnose error`, error)
            return EMPTY
          })
        )
      })
    )
  })

  /**
   * 查询诊断报告
   */
  private queryDiagnosticReport = this.effect((ob: Observable<{
    reportId?: string | null,
    instanceId?: string | null,
    regionId: string
  }>) => {
    return ob.pipe(
      tap(() => {
        this.patchState({loading: {isLoading: true, desc: "查询报告..."}})
        this.patchState({reports: {spinning: true, data: null, error: null}})
      }),
      switchMap(param => {
        const request = {
          RegionId: param.regionId,
          ReportId: param.reportId
        }
        return this.queryDiagnoseReportAttr(request).pipe(
          // expand 递归查询 直至报告完成
          expand((value: any) => this.reportIsFinished(value) ? EMPTY : this.queryDiagnoseReportAttr(request).pipe(delay(5000)), 1),
          takeWhile((value) => !this.reportIsFinished(value), true),
          tapResponse({
            next: value => {
              this.patchState({loading: {isLoading: false, desc: null}})
              this.patchState({reports: {spinning: false, data: [value], error: null}})
            },
            error: error => {
              console.log(error)
              this.patchState({loading: {isLoading: false, desc: null}})
              this.patchState({reports: {spinning: false, data: null, error: null}})
            }
          })
        )
      })
    )
  })

  /**
   * 查询历史诊断报告
   */
  public queryHistoryDiagnosticReport = this.effect((ob: Observable<{
    reportId?: string | null,
    instanceId?: string | null,
    regionId: string
  }>) => {
    return ob.pipe(
      tap(() => {
        this.patchState({loading: {isLoading: true, desc: "查询报告..."}})
        this.patchState({reports: {spinning: true, data: null, error: null}})
      }),
      switchMap(param => {
        // 按照实例id查询, 需要查询实例id 地域
        if (param.instanceId) {
          return this.queryInstanceInfo(param.instanceId).pipe(
            map((data: any) => {
              return {
                reportId: param.reportId,
                instanceId: param.instanceId,
                regionId: data.RegionId
              }
            }),
            catchError(() => {
              this.patchState({loading: {isLoading: false, desc: null}})
              this.patchState({reports: {spinning: false, data: null, error: null}})
              return EMPTY
            })
          )
        }
        // 按照报告id 查询 需要全地域查询归属 暂不支持
        if (param.reportId) {
          this.store.dispatch(displayWarningMessage({
            content: '诊断报告id查询暂不支持'
          }))
          this.patchState({loading: {isLoading: false, desc: null}})
          this.patchState({reports: {spinning: false, data: null, error: null}})
          return EMPTY
        }
        // 不会到这里
        return EMPTY
      }),
      switchMap((param) => {
        // 按照实例id regionId 查询报告信息
        const request = {
          RegionId: param.regionId,
          ResourceId: param.instanceId,
          MaxResult: 100
        }
        return this.queryDiagnoseReport(request).pipe(
          map((data: any) => {
            if (data && data['Reports'] && data['Reports']['Report'].length > 0) {
              return {
                regionId: param.regionId,
                reports: data['Reports']['Report']
              }
            }
            return {
              regionId: param.regionId,
              reports: []
            }
          }),
          catchError(error => {
            console.log(`query diagnose report error`)
            return EMPTY
          })
        )
      }),
      switchMap((data: any) => {
        const {regionId, reports} = data
        const params = reports.map((d: any) => {
          return {
            RegionId: regionId,
            ReportId: d.ReportId
          }
        })
        return from(params).pipe(
          mergeMap(param => {
            return this.queryDiagnoseReportAttr(param)
          }),
          reduce((v1: any[], v2: any) => {
            if (v2) {
              v1.push(v2)
            }
            return v1
          }, []),
          tapResponse({
            next: value => {
              this.patchState({loading: {isLoading: false, desc: null}})
              this.patchState({reports: {spinning: false, data: value, error: null}})
            },
            error: error => {
              console.log(error)
              this.patchState({loading: {isLoading: false, desc: null}})
              this.patchState({reports: {spinning: false, data: null, error: null}})
            }
          })
        )
      })
    )
  })

  private queryDiagnoseReportAttr(param: any) {
    return this.ecsApiService.describeDiagnosticReportAttributes(param)
  }

  private queryDiagnoseReport(request: any) {
    return this.ecsApiService.describeDiagnosticReports(request)
  }

  private reportIsFinished(report: any) {
    for (let i = 0; i < finishedStatus.length; i++) {
      if (report.Status === finishedStatus[i]) {
        return true
      }
    }
    return false
  }

  public readonly reportsData = this.select(state => state.reports)

  public readonly loadingData = this.select(state => state.loading)

}
