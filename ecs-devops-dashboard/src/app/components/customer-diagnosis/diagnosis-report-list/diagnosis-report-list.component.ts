import {Component, Input} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'ops-diagnosis-report-list',
  templateUrl: './diagnosis-report-list.component.html',
  styleUrls: ['./diagnosis-report-list.component.less']
})
export class DiagnosisReportListComponent {

  public diagnoseReports: { data: any, previewInfo: any}[] = []

  private statusMapper: { [key: string]: string } = {
    Submitted: '已提交',
    InProgress: '诊断中',
    RateLimit: '诊断流控',
    Finished: '诊断完成',
    Failed: '诊断失败',
  }

  @Input() loading = true

  @Input()
  set reports(reports: any) {
    this.handlerReports(reports)
  }

  private handlerReports(reports: any) {
    if (reports == null) {
      this.diagnoseReports = []
      return
    }
    //报告转化
    const tmp: any[] = []
    for (let i = 0; i < reports.length; i++) {
      const report = reports[i]
      const {
        ReportId,
        CreationTime,
        Status,
        StartTime,
        EndTime,
        ResourceType,
        ResourceId,
        FinishedTime
      } = report
      const _endTime = EndTime && moment(EndTime).format('YYYY-MM-DD HH:mm:ss');
      const _startTime = StartTime && moment(StartTime).format('YYYY-MM-DD HH:mm:ss');
      const diagnosisTime = CreationTime && moment(CreationTime).format('YYYY-MM-DD HH:mm:ss');

      tmp.push({
        data: report,
        previewInfo: {
          reportId: ReportId,
          resourceId: ResourceId,
          resourceType: ResourceType,
          statusDesc: this.statusMapper[Status],
          diagnosisTime: diagnosisTime,
          cycleTime: `${_startTime} - ${_endTime}`
        },
        active: i == 0
      })
    }
    this.diagnoseReports = tmp
  }

}

