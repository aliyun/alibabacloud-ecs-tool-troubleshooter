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
  public static readonly SELECTED_REGION_INFO_STORE_KEY = "ecs_selected_region_info"

  public static readonly HEALTH_STATUS_MAP: any = {
    "Ok": "正常",
    "Impaired": "服务损坏",
    "Initializing": "初始化中",
    "InsufficientData": "数据不足",
    "NotApplicable": "不适用",
  }

  public static readonly INSTANCE_MAINTENANCE_ATTR_ACTION_OPTIONS: any[] = [
    {
      label: '自动重启恢复',
      value: 'AutoRecover',
      desc: "运行中的实例发生宕机或维护后会自动重启恢复，停止状态下的实例状态将保持不变"
    },
    {
      label: '自动重新部署',
      value: 'AutoRedeploy',
      desc: "运行中的实例发生宕机或维护后自动重新部署，本地盘数据会清空（之前为停止状态的实例状态保持不变，但本地盘数据会清空）"
    },
    {
      label: '禁止重启恢复',
      value: 'Stop',
      desc: "运行中状态的实例发生宕机或维护后不会重启恢复，直接进入停止状态"
    }
  ]

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

  public static readonly DIAGNOSTIC_METRIC_SET_TYPE: any[] = [
    {
      label: '阿里云公共诊断集',
      value: 'Common'
    },
    {
      label: '用户自定义诊断集',
      value: 'User'
    }
  ]

  public static readonly DIAGNOSTIC_RESOURCE_TYPE: any[] = [
    {
      label: '实例',
      value: 'instance'
    },
    {
      label: '账户',
      value: 'account'
    }
  ]

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

