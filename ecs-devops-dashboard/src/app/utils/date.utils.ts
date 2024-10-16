import * as moment from 'moment';

export class DateUtils {

  /**
   * 返回UTC格式的字符串，秒固定为00， 例如 2023-12-01 12:56:43  会转化为 2023-12-01T04:56:00Z
   * @param time
   * @returns
   */
  public static toISOStringWithoutSecond(time: Date | number | string): string {
    return moment(time).utc().format("YYYY-MM-DD[T]HH:mm:00[Z]")
  }

  public static toISOStringWithoutMin(time: Date | number | string): string {
    return moment(time).utc().format("YYYY-MM-DD[T]HH:mm[Z]")
  }

  public static toISOString(time: Date | number | string): string {
    return moment(time).utc().format("YYYY-MM-DD[T]HH:mm:ss[Z]")
  }

  /**
   * 返回UTC格式的字符串
   * @param time
   * @param format
   * @returns
   */
  public static toUTCString(time: Date | number, format = ""): string {
    if (format) {
      return moment(time).utc().format(format)
    }
    return moment(time).utc().format()
  }

  /**
   * 返回指定格式的字符串，默认格式为 YYYY-MM-DD HH:mm:ss
   * @param time
   * @param format
   * @returns
   */
  public static toLocalDateString(time: Date | number, format = "YYYY-MM-DD HH:mm:ss"): string {
    return moment(time).format(format);
  }

  public static addDays(time: Date, days: number): Date {
    return moment(time).add(days, 'days').toDate();
  }

  public static addMonths(time: Date, months: number): Date {
    return moment(time).add(months, 'months').toDate();
  }

}
