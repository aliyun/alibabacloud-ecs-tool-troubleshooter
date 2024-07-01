import * as moment from "moment";
import {GlobalConstant} from "src/app/constants/constants";


export class EventCenterConstant {

  //默认检索数据的天数
  public static DEFAULT_DAY = 30;

  //默认检索数据延后的小时数
  public static DEFAULT_HOUR = 1;

  public static getDefaultSearchTime(startTime = "", endTime = "") {
    if (startTime && endTime) {
      return [
        moment(startTime, GlobalConstant.MOMENT_TIME_FULL_FORMAT).toDate(),
        moment(endTime, GlobalConstant.MOMENT_TIME_FULL_FORMAT).toDate(),
      ]
    }
    return [
      new Date(new Date().getTime() - EventCenterConstant.DEFAULT_DAY * GlobalConstant.THE_TIME_OF_ONE_DAY + EventCenterConstant.DEFAULT_HOUR * GlobalConstant.THE_TIME_OF_ONE_HOUR),
      new Date(new Date().getTime() + EventCenterConstant.DEFAULT_HOUR * GlobalConstant.THE_TIME_OF_ONE_HOUR)
    ]
  }

}
