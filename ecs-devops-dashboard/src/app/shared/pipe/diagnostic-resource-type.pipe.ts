import { Pipe, PipeTransform } from '@angular/core';
import {GlobalConstant} from "../../constants/constants";

@Pipe({
  name: 'diagnosticResourceType',
  standalone: true
})
export class DiagnosticResourceTypePipe implements PipeTransform {

  transform(value: any, ..._ignore: any[]): unknown {
    const filter = GlobalConstant.DIAGNOSTIC_RESOURCE_TYPE.filter(item => item.value === value);
    if (filter.length > 0) {
      return filter[0].label;
    }
    return "";
  }

}
