import {inject, Injectable} from "@angular/core";
import {ComponentStore, tapResponse} from "@ngrx/component-store";
import {catchError, EMPTY, from, Observable, of, switchMap, tap} from "rxjs";
import {EcsApiService} from "../../../api/ecs-api.service";
import {expand, map, mergeMap, reduce, takeWhile} from "rxjs/operators";


@Injectable()
export class MetricSetEffectService extends ComponentStore<any> {

  private ecsApiService = inject(EcsApiService)

  constructor() {
    super({
      metricSetInfo: {
        spinning: false,
        value: [],
        error: null
      },
      metricInfo: {
        spinning: false,
        value: [],
        error: null
      }
    })
  }

  public loadAll(param: any) {
    this.loadAllMetricSetInfo(param)
    this.loadAllMetricInfo(param)
  }

  public readonly loadAllMetricSetInfo = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tap(() => this.patchState({
        metricSetInfo: {
          spinning: true,
          value: [],
          error: null
        }
      })),
      switchMap((item: any) => {
        item['MaxResults'] = 100
        return this.loadMetricSetInfo(item)
      }),
      tapResponse({
        next: value => {
          this.patchState({
            metricSetInfo: {
              spinning: false,
              value: value,
              error: null
            }
          })
        },
        error: err => {
          console.log(`query metricSet error`, err)
          this.patchState({
            metricSetInfo: {
              spinning: false,
              value: [],
              error: null
            }
          })
        }
      })
    )
  })

  private loadMetricSetInfo(param: any) {
    return this.ecsApiService.describeDiagnosticMetricSets(param).pipe(
      expand((value: any) => {
        if (value['NextToken']) {
          param['NextToken'] = value['NextToken']
          return this.ecsApiService.describeDiagnosticMetricSets(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((value: any) => {
        return value['NextToken'] !== undefined || value['NextToken'] !== null
      }, true),
      reduce((v1: [], v2: any) => {
        const value = (v2['MetricSets'] as []);
        v1.push(...value)
        return v1
      }, []),
      map((res) => {
        return res
      }),
      catchError(err => {
        console.log(`query metricSet error`, err)
        return of([])
      })
    )
  }

  public readonly loadAllMetricInfo = this.effect((ob: Observable<any>) => {
    return ob.pipe(
      tap(() => this.patchState({
        metricInfo: {
          spinning: true,
          value: [],
          error: null
        }
      })),
      switchMap((item) => {
        item['MaxResults'] = 100
        return this.loadMetricInfo(item);
      }),
      tapResponse({
        next: value => {
          this.patchState({
            metricInfo: {
              spinning: false,
              value: value,
              error: null
            }
          })
        },
        error: err => {
          console.log(`query metric error`, err)
          this.patchState({
            metricInfo: {
              spinning: false,
              value: [],
              error: null
            }
          })
        }
      })
    )
  })

  private loadMetricInfo(param: any) {
    return this.ecsApiService.describeDiagnosticMetrics(param).pipe(
      expand((value: any) => {
        if (value['NextToken']) {
          param['NextToken'] = value['NextToken']
          return this.ecsApiService.describeDiagnosticMetrics(param)
        } else {
          return EMPTY
        }
      }, 1),
      takeWhile((value: any) => {
        return value['NextToken'] !== undefined || value['NextToken'] !== null
      }, true),
      reduce((v1: [], v2: any) => {
        const value = (v2['Metrics'] as []);
        v1.push(...value)
        return v1
      }, []),
      map((res) => {
        return res
      }),
      catchError(err => {
        console.log(`query metric error`, err)
        return of([])
      })
    )
  }

  public batchCreateMetricSet(params: any, regionIds: string[]) {
    const requestParams = regionIds.map(regionId => {
      return {
        ...params,
        RegionId: regionId
      };
    })

    return from(requestParams).pipe(
      mergeMap((item: any) => {
        return this.createMetricSet(item)
      }),
      reduce((v1: any, v2: any) => {
        v1[v2.RegionId] = v2.Data
        return v1
      }, {}),
      map(res => {
        return res
      }),
      catchError(err => {
        console.log(`batch create metricSet error`, err)
        return of({})
      })
    )
  }

  public createMetricSet(param: any) {
    return this.ecsApiService.createDiagnosticMetricSets(param).pipe(
      map((res: any) => {
        return {
          RegionId: param.RegionId,
          Data: res
        }
      }),
      catchError(err => {
        console.log(`create metricSet error`, err)
        return of({
          RegionId: param.RegionId,
          Data: null
        })
      })
    )
  }

  public modifyMetricSet(param: any) {
    return this.ecsApiService.modifyDiagnosticMetricSets(param).pipe(
      map((res: any) => {
        return res
      }),
      catchError(err => {
        console.log(`modify metricSet error`, err)
        return of(null)
      })
    )
  }

  public deleteMetricSetId(param: any){
    return this.ecsApiService.deleteDiagnosticMetricSets(param).pipe(
      catchError(err => {
        console.log(`delete metricSet error`, err)
        return of(null)
      })
    )
  }


  public metricSetData = this.select((state) => state.metricSetInfo)
  public metricData = this.select((state) => state.metricInfo)

}
