import {Pipe, PipeTransform} from '@angular/core';
import {GlobalConstant} from "../../constants/constants";

@Pipe({
  name: 'instanceStatusDesc',
  standalone: true
})
export class InstanceStatusDescPipe implements PipeTransform {

  transform(value: any, ..._ignore: any[]): unknown {
    return GlobalConstant.INSTANCE_STATUS_MAP[value] || value
  }

}
