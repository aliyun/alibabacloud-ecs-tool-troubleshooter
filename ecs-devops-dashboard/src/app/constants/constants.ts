export class GlobalConstant {

  //一天的毫秒数
  public static readonly THE_TIME_OF_ONE_DAY: number = 24 * 60 * 60 * 1000;

  //一小时的毫秒数
  public static readonly THE_TIME_OF_ONE_HOUR: number = 60 * 60 * 1000;

  public static readonly MOMENT_TIME_FULL_FORMAT = "YYYY-MM-DD HH:mm:ss"


  /**
   * 客户ECS事件
   */
  public static EVENT_TYPES: { [key: string]: string } = {
    "AccountUnbalanced.Delete": "因账号欠费，按量付费实例释放",
    "AccountUnbalanced.Stop": "因账号欠费，按量付费实例停止",
    "InstanceExpiration.Delete": "因包年包月期限到期，实例释放",
    "InstanceExpiration.Stop": "因包年包月期限到期，实例停止",
    "InstanceFailure.Reboot": "因实例错误实例重启",
    "SystemFailure.Delete": "因实例创建失败实例释放",
    "SystemFailure.Reboot": "因系统错误实例重启",
    "SystemFailure.Redeploy": "因系统错误实例重新部署",
    "SystemMaintenance.Reboot": "因系统维护实例重启",
    "SystemMaintenance.Redeploy": "因系统维护实例重新部署",

    "SystemMaintenance.IsolateErrorDisk":"因系统维护隔离坏盘",
    "SystemMaintenance.ReInitErrorDisk":"因系统维护重新初始化坏盘"
  }

  public static readonly ACCESS_KEY_INFO_STORE_KEY = "ecs_access_info"

  public static readonly HEALTH_STATUS_MAP: any = {
    "Ok": "正常",
    "Impaired": "服务损坏",
    "Initializing": "初始化中",
    "InsufficientData": "数据不足",
    "NotApplicable": "不适用",
  }

  public static readonly INSTANCE_STATUS_MAP: any = {
    "Pending": "创建中",
    "Starting": "启动中",
    "Running": "运行中",
    "Stopping": "停止中",
    "Stopped": "已停止",
  }

  public static readonly INTERNET_TYPE_MAP: any = {
    // "public": "公网",
    "vpc": "专有网络",
    "classic": "经典网络"
  }

  public static readonly INSTANCE_CHARGE_TYPE_MAP: any = {
    "PostPaid": "按量付费",
    "PrePaid": "包年包月"
  }

}

export class EventStatus {

  public static INQUIRING = {
    name: "Inquiring",
    desc: "问询中"
  }
  public static SCHEDULED = {
    name: "Scheduled",
    desc: "计划执行"
  };
  public static EXECUTING = {
    name: "Executing",
    desc: "执行中"
  };
  public static EXECUTED = {
    name: "Executed",
    desc: "已完成"
  };
  public static AVOIDED = {
    name: "Avoided",
    desc: "已避免"
  };
  public static FAILED = {
    name: "Failed",
    desc: "执行失败"
  };
  public static CANCELED = {
    name: "Canceled",
    desc: "已取消"
  };

  // 所有事件状态
  public static ALL_EVENT_STATUS = [
    this.INQUIRING, this.SCHEDULED, this.EXECUTING, this.EXECUTED, this.AVOIDED, this.FAILED, this.CANCELED
  ]

}

