import {Injectable} from "@angular/core";

import {INSTANCE_ATTR, INSTANCES} from './data/DescribeInstances'
import {REGIONS} from "./data/DescribeRegions";

import {map, Observable, timer} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {DISKS} from "./data/DescribeDisks";
import {IMAGES} from "./data/DescribeImages";
import {FULL_STATUS} from "./data/DescribeInstanceFullStatus";
import {EVENTS} from "./data/DescribeInstanceHistoryEvents";
import {CREATE_REPORT_RESULT, DESCRIBE_DIAGNOSE_REPORT, DESCRIBE_DIAGNOSE_REPORT_ATTR} from "./data/DiagnoseReport";
import {SystemEventHistograms} from "./data/DescribeSystemEventHistogram";

@Injectable({
  providedIn: 'root'
})
export class GlobalStaticDataService {

  public forward(params: {
    action: string | null,
    params?: any
  }): Observable<HttpResponse<any>> {

    switch (params.action) {
      case 'DescribeRegions':
        return this.describeRegions(params.params)
      case 'DescribeInstances':
        return this.describeInstances(params.params)
      case 'DescribeDisks':
        return this.describeDisks(params.params)
      case 'DescribeImages':
        return this.describeImages(params.params)
      case 'DescribeInstanceHistoryEvents':
        return this.describeInstanceHistoryEvents(params.params)
      case 'DescribeInstancesFullStatus':
        return this.describeInstancesFullStatus(params.params)
      case 'DescribeInstanceAttribute':
        return this.describeInstanceAttribute(params.params)
      case 'CreateDiagnosticReport':
        return this.createDiagnosticReport(params.params)
      case 'DescribeDiagnosticReports':
        return this.describeDiagnosticReports(params.params)
      case 'DescribeDiagnosticReportAttributes':
        return this.describeDiagnosticReportAttributes(params.params)
      case 'DescribeSystemEventHistogram':
        return this.describeSystemEventHistogram(params.params)
      default:
        // 默认 api Not Found
        return timer(200).pipe(
          map(data => {
            throw new HttpErrorResponse({
              error: {},
              status: 404,
              statusText: 'Api Not Found',
            })
          })
        )
    }

  }

  private describeSystemEventHistogram(params?: any) {
    const regionId = params['RegionId'];
    return this.newSuccessResponse(SystemEventHistograms[regionId] || SystemEventHistograms.default);
  }

  private describeInstanceHistoryEvents(params?: any) {
    const regionId = params['RegionId'];
    return this.newSuccessResponse(EVENTS[regionId] || EVENTS.default)
  }

  private describeInstancesFullStatus(params?: any) {
    const regionId = params['RegionId'];
    return this.newSuccessResponse(FULL_STATUS[regionId] || FULL_STATUS.default)
  }

  private describeImages(params?: any) {
    const regionId = params['RegionId'];
    return this.newSuccessResponse(IMAGES[regionId] || IMAGES.default)
  }

  private describeDisks(params?: any) {
    const regionId = params['RegionId'];
    return this.newSuccessResponse(DISKS[regionId] || DISKS.default)
  }

  private describeInstances(params?: any) {
    const regionId = params['RegionId'];
    return this.newSuccessResponse(INSTANCES[regionId] || INSTANCES.default)
  }

  private describeRegions(params: { action: string | null; regionId?: string; params?: any }) {
    return this.newSuccessResponse(REGIONS);
  }


  private describeInstanceAttribute(params: any) {
    const res = INSTANCE_ATTR[params.InstanceId]
    if (res) {
      return this.newSuccessResponse(res)
    }
    return this.newFailResponse({
      Code: "InvalidInstanceId.NotFound",
      Message: "当前Mock数据环境无法使用该实例ID，请配置AccessKey后重试.",
    });
  }

  private createDiagnosticReport(params: any) {
    return this.newSuccessResponse(CREATE_REPORT_RESULT);
  }

  private describeDiagnosticReports(params: any) {
    return this.newSuccessResponse(DESCRIBE_DIAGNOSE_REPORT[params['ResourceId']]);
  }

  private describeDiagnosticReportAttributes(params: any) {
    return this.newSuccessResponse(DESCRIBE_DIAGNOSE_REPORT_ATTR[params['ReportId']]);
  }

  private newSuccessResponse(body: any) {
    return timer(200).pipe(
      map(() => {
        return new HttpResponse({
          body: body
        })
      })
    );
  }

  private newFailResponse(error: any) {
    return timer(200).pipe(
      map(() => {
        throw new HttpErrorResponse({
          error: error,
          status: 400,
          statusText: 'request error',
        })
      })
    );
  }
}
