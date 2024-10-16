


export const METRIC_DATA: any = {
  "RequestId":"473469C7-AA6F-4DC5-B3DB-A3DC0473469C7",
  "NextToken": null,
  "Metrics": [
    {
      "MetricName": "操作系统对应的补丁状态检查",
      "MetricId": "GuestOS.WinUpdatesCheck",
      "Description": "检查操作系统的系统补丁是否存在错误",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "操作系统的核心注册表文件状态检查",
      "MetricId": "GuestOS.WinRegistryStatus",
      "Description": "检查操作系统的核心注册表文件是否存在",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "操作系统准备程序执行状态检查",
      "MetricId": "GuestOS.WinSysprep",
      "Description": "检查操作系统准备程序是否正常",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "操作系统的系统驱动配置检查",
      "MetricId": "GuestOS.WinSystemDrivers",
      "Description": "检查操作系统的系统驱动是否正确",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "操作系统启动项配置检查",
      "MetricId": "GuestOS.WinBootConfig",
      "Description": "检查操作系统的启动项配置是否正确",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "Windows的系统盘分区配置检查",
      "MetricId": "GuestOS.WinDiskPartition",
      "Description": "检查Windows的系统盘分区配置是否正确",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "GPU设备和驱动的状态检查",
      "MetricId": "GuestOS.GPUStatus",
      "Description": "检查GPU的设备本身和驱动状态是否正常",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "检查操作系统是否出现崩溃并重启及原因",
      "MetricId": "GuestOS.GuestOSCrash",
      "Description": "检查实例的操作系统是否因OOM、卡死等出现崩溃并重启",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "虚拟机vport丢失",
      "MetricId": "Instance.VportLost",
      "Description": "虚拟机vport丢失",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "AVS check报错",
      "MetricId": "Instance.AvsCheckError",
      "Description": "AVS check报错",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "PYNC心跳日志丢失",
      "MetricId": "Instance.NcHeartBeatLoss",
      "Description": "PYNC心跳日志丢失",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "管控请求NC超时",
      "MetricId": "Instance.NcTimeout",
      "Description": "管控请求NC超时",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "nc上实例启动失败",
      "MetricId": "Instance.StartFailed",
      "Description": "nc上实例启动失败",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "NC夯机",
      "MetricId": "Instance.NcHang",
      "Description": "NC夯机",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "网卡挂载失败根因定位",
      "MetricId": "Instance.AttachEni",
      "Description": "网卡挂载失败根因定位",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "操作系统曾出现过系统异常或崩溃",
      "MetricId": "GuestOS.SerialConsoleAnalysis",
      "Description": "操作系统曾出现过系统异常或崩溃",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceConfigure"
    },
    {
      "MetricName": "云助手失败原因透出",
      "MetricId": "Instance.DiagnoseStatus",
      "Description": "云助手错误原因透出",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "TDC开盘失败诊断",
      "MetricId": "Instance.CreateDiskException",
      "Description": "TDC开盘失败诊断",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStorage"
    },
    {
      "MetricName": "ECS实例费用状态检查",
      "MetricId": "Instance.ExpenseException",
      "Description": "ECS实例费用状态检查",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.AccountBalance"
    },
    {
      "MetricName": "云盘扩容未生效",
      "MetricId": "Instance.DiskResizeNotEffective",
      "Description": "云盘扩容未生效",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.InstanceStorage"
    },
    {
      "MetricName": "系统初始化状态检查",
      "MetricId": "GuestOS.WinSystemInit",
      "Description": "系统初始化状态检查",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "GuestOS.WinDiskStatus",
      "MetricId": "GuestOS.WinDiskStatus",
      "Description": "Windows磁盘状态检查",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "SecurityGroup.SecurityGroupAclQuotaNotEnough",
      "MetricId": "SecurityGroup.SecurityGroupAclQuotaNotEnough",
      "Description": "安全组内规则达到上限",
      "ResourceType": "securityGroup",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.Quota"
    },
    {
      "MetricName": "NetworkInterface.ResourcesAddToGroupQuotaNotEnough",
      "MetricId": "NetworkInterface.ResourcesAddToGroupQuotaNotEnough",
      "Description": "资源加入安全组达到上限",
      "ResourceType": "networkInterface",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.Quota"
    },
    {
      "MetricName": "Account.SecurityGroupResourceQuotaNotEnough",
      "MetricId": "Account.SecurityGroupResourceQuotaNotEnough",
      "Description": "安全组总数达到上限",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.Quota"
    },
    {
      "MetricName": "Instance.NetworkInterfaceQueueQuotaNotEnough",
      "MetricId": "Instance.NetworkInterfaceQueueQuotaNotEnough",
      "Description": "弹性网卡创建数达到上限",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.Quota"
    },
    {
      "MetricName": "Account.NetworkInterfaceResourceQuotaNotEnough",
      "MetricId": "Account.NetworkInterfaceResourceQuotaNotEnough",
      "Description": "弹性网卡创建数达到上限",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.Quota"
    },
    {
      "MetricName": "Account.ImageResourceQuotaNotEnough",
      "MetricId": "Account.ImageResourceQuotaNotEnough",
      "Description": "镜像数量配额不足",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.Quota"
    },
    {
      "MetricName": "Account.DiskResourceQuotaNotEnough",
      "MetricId": "Account.DiskResourceQuotaNotEnough",
      "Description": "云盘容量配额不足",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.Quota"
    },
    {
      "MetricName": "Instance.SSRVir",
      "MetricId": "Instance.SSRVir",
      "Description": "Instance.SSRVir",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStartOrStopFail"
    },
    {
      "MetricName": "Instance.SSRSystem",
      "MetricId": "Instance.SSRSystem",
      "Description": "Instance.SSRSystem",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStartOrStopFail"
    },
    {
      "MetricName": "Instance.SSRSnapshotOrImage",
      "MetricId": "Instance.SSRSnapshotOrImage",
      "Description": "Instance.SSRSnapshotOrImage",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStartOrStopFail"
    },
    {
      "MetricName": "Instance.SSRPrivateIp",
      "MetricId": "Instance.SSRPrivateIp",
      "Description": "Instance.SSRPrivateIp",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStartOrStopFail"
    },
    {
      "MetricName": "Instance.SSRInventoryNotEnough",
      "MetricId": "Instance.SSRInventoryNotEnough",
      "Description": "Instance.SSRInventoryNotEnough",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStartOrStopFail"
    },
    {
      "MetricName": "Instance.SSRDisk",
      "MetricId": "Instance.SSRDisk",
      "Description": "Instance.SSRDisk",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStartOrStopFail"
    },
    {
      "MetricName": "实例安全封禁的状态检查",
      "MetricId": "Instance.SecurityPunishStatus",
      "Description": "实例安全封禁的状态检查",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.SecurityGroup"
    },
    {
      "MetricName": "启动项相关参数配置检查",
      "MetricId": "GuestOS.BootConfig",
      "Description": "启动项相关参数配置检查",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "历史负载高",
      "MetricId": "Instance.RecentUtilHigh",
      "Description": "历史负载高",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "历史磁盘满",
      "MetricId": "Instance.DiskFull",
      "Description": "历史磁盘满",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStorage"
    },
    {
      "MetricName": "第三方软件安装状态检查",
      "MetricId": "GuestOS.WinThirdPartSoftware",
      "Description": "Windows关键驱动状态检查",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "Windows关键系统进程状态检查",
      "MetricId": "GuestOS.WinSystemProcess",
      "Description": "Windows关键驱动状态检查",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "Windows关键驱动状态检查",
      "MetricId": "GuestOS.WinDriverStatus",
      "Description": "Windows关键驱动状态检查",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "检查KMS秘钥是否正常",
      "MetricId": "Instance.KMSInvalid",
      "Description": "检查KMS秘钥是否正常",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "检查GuestOS到MetaServer的链路网络状况",
      "MetricId": "GuestOS.MetaServerHttpSimulation",
      "Description": "检查GuestOS到MetaServer的链路网络状况",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.Metadata"
    },
    {
      "MetricName": "实例计费不符合预期",
      "MetricId": "Instance.UnexpectedFee",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ActionTrace"
    },
    {
      "MetricName": "实例的安全组配置被修改",
      "MetricId": "Instance.UnexpectedSgMember",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ActionTrace"
    },
    {
      "MetricName": "非预期创建或删除安全组",
      "MetricId": "Instance.UnexpectedSgCreationOrDeletion",
      "Description": "",
      "ResourceType": "securityGroup",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ActionTrace"
    },
    {
      "MetricName": "非预期实例状态变化",
      "MetricId": "Instance.UnexpectedRunningStatus",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ActionTrace"
    },
    {
      "MetricName": "非预期实例创建或释放",
      "MetricId": "Instance.UnexpectedCreationOrRelease",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ActionTrace"
    },
    {
      "MetricName": "实例存在安全风险",
      "MetricId": "Instance.SecurityRisk",
      "Description": "实例存在安全风险",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.SecurityGroup"
    },
    {
      "MetricName": "操作系统因系统本身原因无法正常启动",
      "MetricId": "Instance.BootScreenshot",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceConfigure"
    },
    {
      "MetricName": "cpu利用率过高或网络流量突增导致丢包",
      "MetricId": "Instance.NetworkPacketDrop",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "云系统内部链路存在丢包",
      "MetricId": "Instance.NetworkLinkException",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "检查实例网络指标异常",
      "MetricId": "Instance.NetworkConfigConsistency",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "实例购买问题",
      "MetricId": "Account.InstanceCreate",
      "Description": "",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.AccountBalance"
    },
    {
      "MetricName": "实例续费问题",
      "MetricId": "Account.InstanceRenew",
      "Description": "",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.AccountBalance"
    },
    {
      "MetricName": "实例退款问题",
      "MetricId": "Account.InstanceRefund",
      "Description": "",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.AccountBalance"
    },
    {
      "MetricName": "实例计费类型转换问题",
      "MetricId": "Account.InstanceChargeTypeSwitch",
      "Description": "",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.AccountBalance"
    },
    {
      "MetricName": "实例升降配问题",
      "MetricId": "Account.InstanceUpDownGrade",
      "Description": "",
      "ResourceType": "account",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.AccountBalance"
    },
    {
      "MetricName": "Windows防火墙状态检查",
      "MetricId": "GuestOS.WinFirewall",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "网络配置和状态检查",
      "MetricId": "GuestOS.WinNetworkStatus",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "Administrator账号检查",
      "MetricId": "GuestOS.WinSystemUser",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "检查系统关键配置状态检查",
      "MetricId": "GuestOS.WinSystemConfig",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "系统盘容量使用率过高",
      "MetricId": "GuestOS.WinSysDiskUtil",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "内存使用率过高",
      "MetricId": "GuestOS.WinMemoryUtil",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "单核CPU使用率过高",
      "MetricId": "GuestOS.WinCPUUtil",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Windows",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "检查系统是否发生过OOM",
      "MetricId": "GuestOS.OSOOM",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "时间同步服务状态检查",
      "MetricId": "GuestOS.TimeSyncService",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "SSH服务状态检查",
      "MetricId": "GuestOS.SSHServiceStatus",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "Cloud-init服务状态检查",
      "MetricId": "GuestOS.CloudInitService",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "系统防火墙状态检查",
      "MetricId": "GuestOS.Firewall",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "网络配置和状态检查",
      "MetricId": "GuestOS.NetworkStatus",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "文件系统状态检查",
      "MetricId": "GuestOS.FileSystems",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "系统账号和密码设置检查",
      "MetricId": "GuestOS.SystemUserPwd",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "系统关键文件检查",
      "MetricId": "GuestOS.SystemFiles",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "系统关键配置设置检查",
      "MetricId": "GuestOS.SystemConfig",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "磁盘使用率过高",
      "MetricId": "GuestOS.DiskUtil",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "内存使用率过高",
      "MetricId": "GuestOS.MemUtil",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "CPU使用率过高",
      "MetricId": "GuestOS.CPUUtil",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": true,
      "SupportedOperatingSystem": "Linux",
      "MetricCategory": "ECSService.GuestOS"
    },
    {
      "MetricName": "实例虚拟化异常",
      "MetricId": "Instance.VirtException",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "实例操作系统异常",
      "MetricId": "Instance.SystemException",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "实例申请资源异常",
      "MetricId": "Instance.ResourceNotEnough",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "突发型实例CPU性能受限",
      "MetricId": "Instance.PerfRestrict",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "实例性能短暂受损",
      "MetricId": "Instance.PerformanceAffected",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "实例所在宿主机告警",
      "MetricId": "Instance.HostDownAlert",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "实例的操作系统Crash",
      "MetricId": "Instance.GuestOSCrash",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "实例遇到Intel CPU的Split Lock问题",
      "MetricId": "Instance.CPUSplitLock",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "CPU资源争抢或绑定失败",
      "MetricId": "Instance.CPUException",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "实例管控系统异常",
      "MetricId": "Instance.ControllerError",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.ServiceHealth"
    },
    {
      "MetricName": "安全组入方向常用端口未放开",
      "MetricId": "Instance.SGIngress",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.SecurityGroup"
    },
    {
      "MetricName": "实例磁盘扩缩容异常",
      "MetricId": "Instance.ResizeFsFailure",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStorage"
    },
    {
      "MetricName": "实例磁盘IOHang",
      "MetricId": "Instance.IOHang",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStorage"
    },
    {
      "MetricName": "实例磁盘加载异常",
      "MetricId": "Instance.DiskLoadFailure",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStorage"
    },
    {
      "MetricName": "实例云盘读写受限",
      "MetricId": "Instance.DiskLimit",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceStorage"
    },
    {
      "MetricName": "网络会话异常",
      "MetricId": "Instance.NetworkSessionError",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "网卡加载异常",
      "MetricId": "Instance.NetworkLoadFailure",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "网络流量达到实例网络带宽上限",
      "MetricId": "Instance.NetworkBurstLimit",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "网络突发带宽受限",
      "MetricId": "Instance.NetworkBoundLimit",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "DDos攻击的防护状态异常",
      "MetricId": "Instance.DDoSStatus",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "基础网络配置异常",
      "MetricId": "Instance.ArpPingError",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceNetwork"
    },
    {
      "MetricName": "实例核心操作异常",
      "MetricId": "Instance.OperationFailure",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceConfigure"
    },
    {
      "MetricName": "实例镜像加载异常",
      "MetricId": "Instance.ImageLoadFailure",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceConfigure"
    },
    {
      "MetricName": "实例启动异常",
      "MetricId": "Instance.BootFailure",
      "Description": "",
      "ResourceType": "instance",
      "GuestMetric": false,
      "SupportedOperatingSystem": "All",
      "MetricCategory": "ECSService.InstanceConfigure"
    }
  ]
}
