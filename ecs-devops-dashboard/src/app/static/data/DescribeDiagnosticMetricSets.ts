

export const METRIC_SETS_COMMON: any = {
  "RequestId": "20000000-0000-0000-0000-000000000000",
  "NextToken": null,
  "MetricSets": [
    {
      "Type": "Common",
      "Description": "大官网quota诊断",
      "MetricIds": [
        "Account.DiskResourceQuotaNotEnough",
        "Account.ImageResourceQuotaNotEnough",
        "Account.NetworkInterfaceResourceQuotaNotEnough",
        "Account.SecurityGroupResourceQuotaNotEnough"
      ],
      "MetricSetId": "dms-aliyundotcomquota",
      "ResourceType": "account",
      "MetricSetName": "大官网quota诊断"
    },
    {
      "Type": "Common",
      "Description": "大官网actiontrail诊断",
      "MetricIds": [
        "Instance.UnexpectedCreationOrRelease",
        "Instance.UnexpectedFee",
        "Instance.UnexpectedRunningStatus",
        "Instance.UnexpectedSgMember"
      ],
      "MetricSetId": "dms-aliyundotcomactiontrail",
      "ResourceType": "instance",
      "MetricSetName": "大官网actiontrail诊断"
    },
    {
      "Type": "Common",
      "Description": "GPU设备诊断",
      "MetricIds": [
        "GuestOS.GPUStatus"
      ],
      "MetricSetId": "dms-instancedevice",
      "ResourceType": "instance",
      "MetricSetName": "GPU设备诊断"
    },
    {
      "Type": "Common",
      "Description": "windows离线诊断集",
      "MetricIds": [
        "GuestOS.WinBootConfig",
        "GuestOS.WinDiskPartition",
        "GuestOS.WinRegistryStatus",
        "GuestOS.WinSysprep",
        "GuestOS.WinSystemDrivers",
        "GuestOS.WinUpdatesCheck"
      ],
      "MetricSetId": "dms-windowsofflinediagnosefull",
      "ResourceType": "instance",
      "MetricSetName": "windows离线诊断集"
    },
    {
      "Type": "Common",
      "MetricIds": [
        "Instance.GuestOSCrash"
      ],
      "MetricSetId": "dms-unexpectedreboot",
      "ResourceType": "instance",
      "MetricSetName": "实例出现非预期重启"
    },
    {
      "Type": "Common",
      "Description": "OS运行中，但网络配置异常导致网络不通或者OS因系统文件缺失或进入修复模式或hang在启动阶段",
      "MetricIds": [
        "GuestOS.SerialConsoleAnalysis",
        "Instance.ArpPingError",
        "Instance.BootFailure",
        "Instance.BootScreenshot",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.DDoSStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.ExpenseException",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.KMSInvalid",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLinkException",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError",
        "Instance.OperationFailure",
        "Instance.RecentUtilHigh",
        "Instance.ResourceNotEnough",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk",
        "Instance.SGIngress",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-osstartfaildiagnose",
      "ResourceType": "instance",
      "MetricSetName": "os启动失败或启动过久"
    },
    {
      "Type": "Common",
      "Description": "远程无法连接=健康诊断集=guest os诊断集 + 非guest os诊断集",
      "MetricIds": [
        "GuestOS.CloudInitService",
        "GuestOS.CPUUtil",
        "GuestOS.DiskUtil",
        "GuestOS.FileSystems",
        "GuestOS.Firewall",
        "GuestOS.MemUtil",
        "GuestOS.NetworkStatus",
        "GuestOS.OSOOM",
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemConfig",
        "GuestOS.SystemFiles",
        "GuestOS.SystemUserPwd",
        "GuestOS.TimeSyncService",
        "GuestOS.WinCPUUtil",
        "GuestOS.WinDiskStatus",
        "GuestOS.WinDriverStatus",
        "GuestOS.WinFirewall",
        "GuestOS.WinMemoryUtil",
        "GuestOS.WinNetworkStatus",
        "GuestOS.WinSysDiskUtil",
        "GuestOS.WinSystemConfig",
        "GuestOS.WinSystemInit",
        "GuestOS.WinSystemProcess",
        "GuestOS.WinSystemUser",
        "GuestOS.WinThirdPartSoftware",
        "Instance.DDoSStatus",
        "Instance.DiagnoseStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.ExpenseException",
        "Instance.GuestOSCrash",
        "Instance.IOHang",
        "Instance.KMSInvalid",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkSessionError",
        "Instance.RecentUtilHigh",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk",
        "Instance.SGIngress",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-remoteconnectdiagnose",
      "ResourceType": "instance",
      "MetricSetName": "远程无法连接默认诊断集"
    },
    {
      "Type": "Common",
      "Description": "远程无法连接-性能受损场景，工单渠道",
      "MetricIds": [
        "GuestOS.CloudInitService",
        "GuestOS.CPUUtil",
        "GuestOS.DiskUtil",
        "GuestOS.FileSystems",
        "GuestOS.Firewall",
        "GuestOS.MemUtil",
        "GuestOS.NetworkStatus",
        "GuestOS.OSOOM",
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemConfig",
        "GuestOS.SystemFiles",
        "GuestOS.SystemUserPwd",
        "GuestOS.TimeSyncService",
        "GuestOS.WinCPUUtil",
        "GuestOS.WinDiskStatus",
        "GuestOS.WinDriverStatus",
        "GuestOS.WinFirewall",
        "GuestOS.WinMemoryUtil",
        "GuestOS.WinNetworkStatus",
        "GuestOS.WinSysDiskUtil",
        "GuestOS.WinSystemConfig",
        "GuestOS.WinSystemInit",
        "GuestOS.WinSystemProcess",
        "GuestOS.WinSystemUser",
        "GuestOS.WinThirdPartSoftware",
        "Instance.ArpPingError",
        "Instance.CPUSplitLock",
        "Instance.DDoSStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.GuestOSCrash",
        "Instance.IOHang",
        "Instance.KMSInvalid",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLinkException",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError",
        "Instance.PerformanceAffected",
        "Instance.PerfRestrict",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk"
      ],
      "MetricSetId": "dms-performancedamaged",
      "ResourceType": "instance",
      "MetricSetName": "远程无法连接-性能受损场景"
    },
    {
      "Type": "Common",
      "Description": "实例规格不可见",
      "MetricIds": [
        "Instance.TypeInvisible"
      ],
      "MetricSetId": "dms-instancetypeinvisible",
      "ResourceType": "instance",
      "MetricSetName": "实例规格不可见"
    },
    {
      "Type": "Common",
      "Description": "嫦娥诊断集非guestos",
      "MetricIds": [
        "Instance.ArpPingError",
        "Instance.BootFailure",
        "Instance.BootScreenshot",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.CPUSplitLock",
        "Instance.DDoSStatus",
        "Instance.DiagnoseStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.ExpenseException",
        "Instance.GuestOSCrash",
        "Instance.HostDownAlert",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError",
        "Instance.OperationFailure",
        "Instance.PerformanceAffected",
        "Instance.PerfRestrict",
        "Instance.RecentUtilHigh",
        "Instance.ResizeFsFailure",
        "Instance.ResourceNotEnough",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk",
        "Instance.SGIngress",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-changeplusnoguest",
      "ResourceType": "instance",
      "MetricSetName": "嫦娥诊断集非guestos"
    },
    {
      "Type": "Common",
      "Description": "嫦娥的诊断集全集",
      "MetricIds": [
        "GuestOS.CloudInitService",
        "GuestOS.CPUUtil",
        "GuestOS.DiskIOPSUtil",
        "GuestOS.DiskUtil",
        "GuestOS.FileSystems",
        "GuestOS.Firewall",
        "GuestOS.GPUStatus",
        "GuestOS.MemUtil",
        "GuestOS.NetworkStatus",
        "GuestOS.OSOOM",
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemConfig",
        "GuestOS.SystemFiles",
        "GuestOS.SystemUserPwd",
        "GuestOS.TimeSyncService",
        "GuestOS.WinCPUUtil",
        "GuestOS.WinDiskStatus",
        "GuestOS.WinDriverStatus",
        "GuestOS.WinFirewall",
        "GuestOS.WinMemoryUtil",
        "GuestOS.WinNetworkStatus",
        "GuestOS.WinSysDiskUtil",
        "GuestOS.WinSystemConfig",
        "GuestOS.WinSystemInit",
        "GuestOS.WinSystemProcess",
        "GuestOS.WinSystemUser",
        "GuestOS.WinThirdPartSoftware",
        "Instance.ArpPingError",
        "Instance.BootFailure",
        "Instance.BootScreenshot",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.CPUSplitLock",
        "Instance.DDoSStatus",
        "Instance.DiagnoseStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.ExpenseException",
        "Instance.GuestOSCrash",
        "Instance.HostDownAlert",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError",
        "Instance.OperationFailure",
        "Instance.PerformanceAffected",
        "Instance.PerfRestrict",
        "Instance.RecentUtilHigh",
        "Instance.ResizeFsFailure",
        "Instance.ResourceNotEnough",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk",
        "Instance.SGIngress",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-changeplusfull",
      "ResourceType": "instance",
      "MetricSetName": "嫦娥的诊断集全集"
    },
    {
      "Type": "Common",
      "MetricIds": [
        "Instance.ArpPingError",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.CPUSplitLock",
        "Instance.DDoSStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.GuestOSCrash",
        "Instance.HostDownAlert",
        "Instance.IOHang",
        "Instance.KMSInvalid",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLinkException",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError",
        "Instance.PerformanceAffected",
        "Instance.PerfRestrict",
        "Instance.ResizeFsFailure",
        "Instance.ResourceNotEnough",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-localservicesdiagnose",
      "ResourceType": "instance"
    },
    {
      "Type": "Common",
      "MetricIds": [
        "Instance.AvsCheckError",
        "Instance.NcHang",
        "Instance.NcHeartBeatLoss",
        "Instance.NcTimeout",
        "Instance.StartFailed",
        "Instance.VportLost"
      ],
      "MetricSetId": "dms-ncnotworktest",
      "ResourceType": "instance"
    },
    {
      "Type": "Common",
      "MetricIds": [
        "GuestOS.GuestOSCrash",
        "GuestOS.SerialConsoleAnalysis",
        "Instance.CPUException",
        "Instance.SGIngress"
      ],
      "MetricSetId": "dms-serialconsoletest",
      "ResourceType": "instance",
      "MetricSetName": "test"
    },
    {
      "Type": "Common",
      "MetricIds": [
        "Instance.ArpPingError",
        "Instance.BootFailure",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.CPUSplitLock",
        "Instance.DDoSStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.GuestOSCrash",
        "Instance.HostDownAlert",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError",
        "Instance.OperationFailure",
        "Instance.PerformanceAffected",
        "Instance.PerfRestrict",
        "Instance.RecentUtilHigh",
        "Instance.ResizeFsFailure",
        "Instance.ResourceNotEnough",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-globalbizplatform",
      "ResourceType": "instance",
      "MetricSetName": "全球化业务使用"
    },
    {
      "Type": "Common",
      "MetricIds": [
        "Instance.AttachEni"
      ],
      "MetricSetId": "dms-attachenifail",
      "ResourceType": "instance",
      "MetricSetName": "挂载网卡失败诊断"
    },
    {
      "Type": "Common",
      "Description": "安全封禁诊断集",
      "MetricIds": [
        "Instance.DDoSStatus",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk"
      ],
      "MetricSetId": "dms-securitypunish",
      "ResourceType": "instance",
      "MetricSetName": "安全封禁诊断集"
    },
    {
      "Type": "Common",
      "Description": "WorkBench登录失败",
      "MetricIds": [
        "GuestOS.CloudInitService",
        "GuestOS.Firewall",
        "GuestOS.NetworkStatus",
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemConfig",
        "GuestOS.SystemUserPwd",
        "GuestOS.WinFirewall",
        "GuestOS.WinNetworkStatus",
        "GuestOS.WinSystemInit",
        "GuestOS.WinSystemProcess",
        "GuestOS.WinSystemUser",
        "GuestOS.WinThirdPartSoftware",
        "Instance.DiagnoseStatus"
      ],
      "MetricSetId": "dms-loginworkbenchfail",
      "ResourceType": "instance",
      "MetricSetName": "WorkBench登录失败"
    },
    {
      "Type": "Common",
      "Description": "C2V诊断集",
      "MetricIds": [
        "Instance.BootFailure",
        "Instance.BootScreenshot",
        "Instance.CreateDiskException",
        "Instance.DiskLoadFailure",
        "Instance.GuestOSCrash",
        "Instance.ImageLoadFailure"
      ],
      "MetricSetId": "dms-c2vdiagnose",
      "ResourceType": "instance",
      "MetricSetName": "C2V诊断集"
    },
    {
      "Type": "Common",
      "Description": "云盘扩容未生效",
      "MetricIds": [
        "Instance.DiskResizeNotEffective"
      ],
      "MetricSetId": "dms-diskresizediagnose",
      "ResourceType": "instance",
      "MetricSetName": "云盘扩容未生效"
    },
    {
      "Type": "Common",
      "Description": "网卡总队列数达到上限",
      "MetricIds": [
        "Instance.NetworkInterfaceQueueQuotaNotEnough"
      ],
      "MetricSetId": "dms-networkinterfacequeuequotadiagnose",
      "ResourceType": "instance",
      "MetricSetName": "网卡总队列数达到上限"
    },
    {
      "Type": "Common",
      "Description": "弹性网卡创建数达到上限",
      "MetricIds": [
        "Account.NetworkInterfaceResourceQuotaNotEnough"
      ],
      "MetricSetId": "dms-networkinterfacequotadiagnose",
      "ResourceType": "account",
      "MetricSetName": "弹性网卡创建数达到上限"
    },
    {
      "Type": "Common",
      "Description": "安全组内规则达到上限",
      "MetricIds": [
        "SecurityGroup.SecurityGroupAclQuotaNotEnough"
      ],
      "MetricSetId": "dms-sgrulequotadiagnose",
      "ResourceType": "securityGroup",
      "MetricSetName": "安全组内规则达到上限"
    },
    {
      "Type": "Common",
      "Description": "资源加入安全组达到上限",
      "MetricIds": [
        "NetworkInterface.ResourcesAddToGroupQuotaNotEnough"
      ],
      "MetricSetId": "dms-resourcejoinsgquotadiagnose",
      "ResourceType": "networkInterface",
      "MetricSetName": "资源加入安全组达到上限"
    },
    {
      "Type": "Common",
      "Description": "安全组总数达到上限",
      "MetricIds": [
        "Account.SecurityGroupResourceQuotaNotEnough"
      ],
      "MetricSetId": "dms-sgquotadiagnose",
      "ResourceType": "account",
      "MetricSetName": "安全组总数达到上限"
    },
    {
      "Type": "Common",
      "Description": "网卡总队列数达到上限",
      "MetricIds": [
        "Instance.NetworkInterfaceQueueQuotaNotEnough"
      ],
      "MetricSetId": "dms-eniqueuequotadiagnose",
      "ResourceType": "instance",
      "MetricSetName": "网卡总队列数达到上限"
    },
    {
      "Type": "Common",
      "Description": "弹性网卡创建数达到上限",
      "MetricIds": [
        "Account.NetworkInterfaceResourceQuotaNotEnough"
      ],
      "MetricSetId": "dms-eniquotadiagnose",
      "ResourceType": "account",
      "MetricSetName": "dms-eniquotadiagnose"
    },
    {
      "Type": "Common",
      "Description": "镜像数量配额不足",
      "MetricIds": [
        "Account.ImageResourceQuotaNotEnough"
      ],
      "MetricSetId": "dms-imagequotadiagnose",
      "ResourceType": "account",
      "MetricSetName": "dms-imagequotadiagnose"
    },
    {
      "Type": "Common",
      "Description": "云盘容量配额不足",
      "MetricIds": [
        "Account.DiskResourceQuotaNotEnough"
      ],
      "MetricSetId": "dms-diskvolumequotadiagnose",
      "ResourceType": "account",
      "MetricSetName": "dms-diskvolumequotadiagnose"
    },
    {
      "Type": "Common",
      "Description": "离线诊断全集",
      "MetricIds": [
        "GuestOS.BootConfig",
        "GuestOS.DiskUtil",
        "GuestOS.FileSystems",
        "GuestOS.SystemFiles",
        "Instance.SSRDisk",
        "Instance.SSRInventoryNotEnough",
        "Instance.SSRPrivateIp",
        "Instance.SSRSnapshotOrImage",
        "Instance.SSRSystem",
        "Instance.SSRVir"
      ],
      "MetricSetId": "dms-offlinediagnosefull",
      "ResourceType": "instance",
      "MetricSetName": "离线诊断全集"
    },
    {
      "Type": "Common",
      "Description": "轻量服务器诊断",
      "MetricIds": [
        "GuestOS.CPUUtil",
        "GuestOS.DiskUtil",
        "GuestOS.Firewall",
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemConfig",
        "GuestOS.WinCPUUtil",
        "GuestOS.WinFirewall",
        "GuestOS.WinMemoryUtil",
        "GuestOS.WinNetworkStatus",
        "GuestOS.WinSysDiskUtil",
        "GuestOS.WinSystemConfig",
        "GuestOS.WinSystemUser",
        "Instance.BootFailure",
        "Instance.DDoSStatus",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.DiskResizeNotEffective",
        "Instance.HostDownAlert",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.NetworkSessionError",
        "Instance.OperationFailure",
        "Instance.ResizeFsFailure",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-swasdiagnose",
      "ResourceType": "instance",
      "MetricSetName": "轻量服务器诊断"
    },
    {
      "Type": "Common",
      "Description": "默认诊断集",
      "MetricIds": [
        "GuestOS.SerialConsoleAnalysis",
        "Instance.BootFailure",
        "Instance.BootScreenshot",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.ExpenseException",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.KMSInvalid",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkSessionError",
        "Instance.OperationFailure",
        "Instance.RecentUtilHigh",
        "Instance.ResourceNotEnough",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk",
        "Instance.SGIngress",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-nodecontrollerdiagnose",
      "ResourceType": "instance",
      "MetricSetName": "默认诊断集"
    },
    {
      "Type": "Common",
      "Description": "instancestartingdiagnose",
      "MetricIds": [
        "GuestOS.SerialConsoleAnalysis",
        "Instance.BootFailure",
        "Instance.BootScreenshot",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.DiskFull",
        "Instance.DiskLoadFailure",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.KMSInvalid",
        "Instance.OperationFailure",
        "Instance.ResourceNotEnough",
        "Instance.SecurityPunishStatus",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-instancestartingdiagnose",
      "ResourceType": "instance",
      "MetricSetName": "instancestartingdiagnose"
    },
    {
      "Type": "Common",
      "Description": "离线诊断",
      "MetricIds": [
        "GuestOS.BootConfig",
        "GuestOS.DiskUtil",
        "GuestOS.FileSystems",
        "GuestOS.SystemFiles",
        "GuestOS.WinRegistryStatus",
        "GuestOS.WinSystemDrivers"
      ],
      "MetricSetId": "dms-offlinediagnose",
      "ResourceType": "instance",
      "MetricSetName": "OfflineGuestOSDiagnose"
    },
    {
      "Type": "Common",
      "Description": "ResetPasswordMetricSet",
      "MetricIds": [
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemUserPwd",
        "GuestOS.WinSystemUser",
        "GuestOS.WinThirdPartSoftware"
      ],
      "MetricSetId": "dms-resetpassword",
      "ResourceType": "instance",
      "MetricSetName": "ResetPasswordMetricSet"
    },
    {
      "Type": "Common",
      "Description": "远程无法连接诊断集",
      "MetricIds": [
        "GuestOS.CPUUtil",
        "GuestOS.DiskUtil",
        "GuestOS.Firewall",
        "GuestOS.MemUtil",
        "GuestOS.NetworkStatus",
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemConfig",
        "GuestOS.SystemUserPwd",
        "GuestOS.WinCPUUtil",
        "GuestOS.WinFirewall",
        "GuestOS.WinMemoryUtil",
        "GuestOS.WinNetworkStatus",
        "GuestOS.WinSysDiskUtil",
        "GuestOS.WinSystemUser",
        "Instance.ExpenseException"
      ],
      "MetricSetId": "dms-remoteconnect",
      "ResourceType": "instance",
      "MetricSetName": "实例远程连接检测"
    },
    {
      "Type": "Common",
      "Description": "检查MetaData检查度",
      "MetricIds": [
        "GuestOS.MetaServerHttpSimulation",
        "MetaData.DataExistence",
        "MetaData.EniAndEcsNotInSameVpc",
        "MetaData.HardenedAccessMode",
        "MetaData.SLBReliability",
        "MetaData.StsTokenValidity"
      ],
      "MetricSetId": "dms-metadatacheck",
      "ResourceType": "instance",
      "MetricSetName": "元数据检查"
    },
    {
      "Type": "Common",
      "Description": "不符合预期的涉及实例费用相关的操作行为审计查询",
      "MetricIds": [
        "Instance.UnexpectedFee"
      ],
      "MetricSetId": "dms-unexpectedinstancefee",
      "ResourceType": "instance",
      "MetricSetName": "实例计费不符合预期"
    },
    {
      "Type": "Common",
      "Description": "不符合操作预期的实例关联加入和离开安全组的行为审计查询",
      "MetricIds": [
        "Instance.UnexpectedSgMember"
      ],
      "MetricSetId": "dms-unexpectedsgmember",
      "ResourceType": "instance",
      "MetricSetName": "实例的安全组配置被修改"
    },
    {
      "Type": "Common",
      "Description": "不符合操作预期的实例关联安全组的行为审计查询",
      "MetricIds": [
        "Instance.UnexpectedSgCreationOrDeletion"
      ],
      "MetricSetId": "dms-unexpectedsgcreationordeletion",
      "ResourceType": "securityGroup",
      "MetricSetName": "非预期创建或删除安全组"
    },
    {
      "Type": "Common",
      "Description": "不符合操作预期的实例启动、停止等行为审计查询",
      "MetricIds": [
        "Instance.UnexpectedRunningStatus"
      ],
      "MetricSetId": "dms-unexpectedinstancerunningstatus",
      "ResourceType": "instance",
      "MetricSetName": "非预期实例状态变化"
    },
    {
      "Type": "Common",
      "Description": "不符合操作预期的实例创建或释放行为审计查询",
      "MetricIds": [
        "Instance.UnexpectedCreationOrRelease"
      ],
      "MetricSetId": "dms-unexpectedinstancecreationorrelease",
      "ResourceType": "instance",
      "MetricSetName": "非预期实例创建或释放"
    },
    {
      "Type": "Common",
      "Description": "实例安全风险检测",
      "MetricIds": [
        "Instance.DDoSStatus",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk"
      ],
      "MetricSetId": "dms-instancesecurityrisk",
      "ResourceType": "instance",
      "MetricSetName": "实例安全风险检测"
    },
    {
      "Type": "Common",
      "Description": "",
      "MetricIds": [
        "Instance.BootScreenshot"
      ],
      "MetricSetId": "dms-instancebootscreenshot",
      "ResourceType": "instance",
      "MetricSetName": "实例截屏诊断"
    },
    {
      "Type": "Common",
      "Description": "网络性能受损",
      "MetricIds": [
        "Instance.DDoSStatus",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkLinkException",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError"
      ],
      "MetricSetId": "dms-networkperformancedamaged",
      "ResourceType": "instance",
      "MetricSetName": "网络性能受损"
    },
    {
      "Type": "Common",
      "Description": "Instance create metric set",
      "MetricIds": [
        "Account.InstanceCreate"
      ],
      "MetricSetId": "dms-instancecreate",
      "ResourceType": "account",
      "MetricSetName": "实例创建检测"
    },
    {
      "Type": "Common",
      "Description": "Instance renew metric set",
      "MetricIds": [
        "Account.InstanceRenew"
      ],
      "MetricSetId": "dms-instancerenew",
      "ResourceType": "account",
      "MetricSetName": "实例续费"
    },
    {
      "Type": "Common",
      "Description": "Instance refund metric set",
      "MetricIds": [
        "Account.InstanceRefund"
      ],
      "MetricSetId": "dms-instancerefund",
      "ResourceType": "account",
      "MetricSetName": "实例退款问题"
    },
    {
      "Type": "Common",
      "Description": "Instance charge type switch metric set",
      "MetricIds": [
        "Account.InstanceChargeTypeSwitch"
      ],
      "MetricSetId": "dms-instancechargetypeswitch",
      "ResourceType": "account",
      "MetricSetName": "实例计费类型转换"
    },
    {
      "Type": "Common",
      "Description": "Instance upgrade and downgrade metric set",
      "MetricIds": [
        "Account.InstanceUpDownGrade"
      ],
      "MetricSetId": "dms-instanceupdowngrade",
      "ResourceType": "account",
      "MetricSetName": "实例升降配"
    },
    {
      "Type": "Common",
      "Description": "默认诊断集",
      "MetricIds": [
        "GuestOS.CloudInitService",
        "GuestOS.CPUUtil",
        "GuestOS.DiskIOPSUtil",
        "GuestOS.DiskUtil",
        "GuestOS.FileSystems",
        "GuestOS.Firewall",
        "GuestOS.GPUStatus",
        "GuestOS.MemUtil",
        "GuestOS.NetworkStatus",
        "GuestOS.OSOOM",
        "GuestOS.SSHServiceStatus",
        "GuestOS.SystemConfig",
        "GuestOS.SystemFiles",
        "GuestOS.SystemUserPwd",
        "GuestOS.TimeSyncService",
        "GuestOS.WinCPUUtil",
        "GuestOS.WinDiskStatus",
        "GuestOS.WinDriverStatus",
        "GuestOS.WinFirewall",
        "GuestOS.WinMemoryUtil",
        "GuestOS.WinNetworkStatus",
        "GuestOS.WinSysDiskUtil",
        "GuestOS.WinSystemConfig",
        "GuestOS.WinSystemInit",
        "GuestOS.WinSystemProcess",
        "GuestOS.WinSystemUser",
        "GuestOS.WinThirdPartSoftware",
        "GuestOS.WinUpdatesCheck",
        "Instance.ArpPingError",
        "Instance.BootFailure",
        "Instance.BootScreenshot",
        "Instance.ControllerError",
        "Instance.CPUException",
        "Instance.CPUSplitLock",
        "Instance.DDoSStatus",
        "Instance.DiagnoseStatus",
        "Instance.DiskFull",
        "Instance.DiskLimit",
        "Instance.DiskLoadFailure",
        "Instance.ExpenseException",
        "Instance.GuestOSCrash",
        "Instance.HostDownAlert",
        "Instance.ImageLoadFailure",
        "Instance.IOHang",
        "Instance.NetworkBoundLimit",
        "Instance.NetworkBurstLimit",
        "Instance.NetworkLoadFailure",
        "Instance.NetworkPacketDrop",
        "Instance.NetworkSessionError",
        "Instance.OperationFailure",
        "Instance.PerformanceAffected",
        "Instance.PerfRestrict",
        "Instance.RecentUtilHigh",
        "Instance.ResizeFsFailure",
        "Instance.ResourceNotEnough",
        "Instance.SecurityPunishStatus",
        "Instance.SecurityRisk",
        "Instance.SGIngress",
        "Instance.SystemException",
        "Instance.VirtException"
      ],
      "MetricSetId": "dms-instancedefault",
      "ResourceType": "instance",
      "MetricSetName": "默认诊断集"
    }
  ]
}


export const METRIC_SETS_USER: any = {
  "RequestId": "20000000-0000-0000-0000-000000000000",
  "NextToken": null,
  "MetricSets": [
    {
      "Type": "User",
      "Description": "实例状态检测",
      "MetricIds": [
        "Instance.CreateDiskException",
        "Instance.DiagnoseStatus",
        "Instance.ExpenseException"
      ],
      "MetricSetId": "dms-bp18oas3t27bv9nsvbtx",
      "ResourceType": "instance",
      "MetricSetName": "实例状态检测"
    },
    {
      "Type": "User",
      "Description": "win系统启动项配置检查",
      "MetricIds": [
        "GuestOS.WinBootConfig",
        "GuestOS.WinSystemDrivers"
      ],
      "MetricSetId": "dms-bp1d60tmt81dvu5hv598",
      "ResourceType": "instance",
      "MetricSetName": "系统启动项配置检查"
    },
    {
      "Type": "User",
      "Description": "win补丁状态检查",
      "MetricIds": [
        "GuestOS.WinUpdatesCheck"
      ],
      "MetricSetId": "dms-bp1hst6plolmcwcjoy7j",
      "ResourceType": "instance",
      "MetricSetName": "补丁状态检查"
    }
  ]
}
