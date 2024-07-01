import {Pipe, PipeTransform} from "@angular/core";
import {GlobalConstant} from "../../constants/constants";


@Pipe({
  name: 'healthStatusDesc',
  standalone: true
})
export class HealthStatusDescPipe implements PipeTransform {

  transform(value: any, ..._ignore: any[]): any {
    return GlobalConstant.HEALTH_STATUS_MAP[value] || value
  }
}
