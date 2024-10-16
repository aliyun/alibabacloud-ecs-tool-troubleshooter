import {Pipe, PipeTransform} from '@angular/core';
import {DateUtils} from "../../utils/date.utils";

@Pipe({
  name: 'localDate',
  standalone: true
})
export class LocalDatePipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    if (value){
      return DateUtils.toLocalDateString(value);
    }
    return '-'
  }

}
