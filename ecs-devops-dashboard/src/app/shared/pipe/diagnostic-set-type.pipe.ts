import {Pipe, PipeTransform} from '@angular/core';
import {GlobalConstant} from "../../constants/constants";

@Pipe({
  name: 'diagnosticSetType',
  standalone: true
})
export class DiagnosticSetTypePipe implements PipeTransform {

  transform(value: any, ...ignore: any[]): any {
    const filter = GlobalConstant.DIAGNOSTIC_METRIC_SET_TYPE.filter(item => item.value === value);
    if (filter.length > 0) {
      return filter[0].label;
    }
    return "";
  }

}
