export class SystemUtil {

  public static isInstanceId(id: string): boolean {
    if (/^(i-|AY|eci-|cp-|ic-|BVT|wh|cn|wy|qy|hm|VM|al|uh|ay|tmpvm|ace|hbm-|netvm-|vm)[a-zA-Z0-9,]*$/.test(id)) {
      if (id.length === 11 || id.length === 22 || id.length === 20 || id.length === 21 || id.length === 24) {
        return true;
      }
    }
    return false;
  }

  public static isVm(machineId: string) {
    return /^(i-|AY|eci-|cp-|ic-|BVT|wh|cn|wy|qy|hm|VM|al|uh|ay|tmpvm|ace|hbm-|netvm-|vm)[a-zA-Z0-9,]*$/.test(machineId);
  }

  public static isAliUid(id: string): boolean {
    return /^\+?[1-9][0-9]*$/.test(id);
  }


  private static readonly CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  /**
   * 随机生成 指定位数的字符串
   * @param length 长度
   */
  public static generateRandomString(length: number): string {
    // 定义可能的字符集
    let result = '';
    const charactersLength = SystemUtil.CHARACTERS.length;

    for (let i = 0; i < length; i++) {
      result += SystemUtil.CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

}
