import {Pipe, PipeTransform} from '@angular/core';
import {GlobalConstant} from "../../constants/constants";

@Pipe({
  name: 'instanceMaintenanceAttr',
  standalone: true
})
export class InstanceMaintenanceAttrPipe implements PipeTransform {

  transform(value: any, ..._ignore: any[]): any {
    const item = GlobalConstant.INSTANCE_MAINTENANCE_ATTR_ACTION_OPTIONS.find(item => item.value === value);
    return item ? item : {
      label: "",
      desc: ""
    };
  }

}
