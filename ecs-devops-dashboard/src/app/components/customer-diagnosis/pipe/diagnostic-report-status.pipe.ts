import { Pipe, PipeTransform } from '@angular/core';
import {STATUS_MAPPER} from "../constants/customer-diagnosis.constants";

@Pipe({
  name: 'diagnosticReportStatus'
})
export class DiagnosticReportStatusPipe implements PipeTransform {

  transform(value: string, ...args: any[]): unknown {
    return STATUS_MAPPER[value] || value;
  }

}
