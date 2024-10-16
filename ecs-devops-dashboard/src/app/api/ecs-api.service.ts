import {DestroyRef, inject, Injectable} from "@angular/core";
import {BaseApiRequest, ERROR_SILENT} from "../shared/models/models";
import {HttpClient, HttpContext} from "@angular/common/http";
import {AliYunClientService} from "../services/aliyun-client.service";
import {Store} from "@ngrx/store";
import {AliYunClientConfig} from "../services/config/aliyun-client-config";
import {selectAccessKeyInfo, selectAllRegionInfo} from "../ngrx/selectors/global.select";


/**
 * 封装 ECS 相关 API
 * @link https://next.api.aliyun.com/api/Ecs/2014-05-26
 */
@Injectable({
  providedIn: "root"
})
export class EcsApiService {

  private store = inject(Store)

  constructor(httpClient: HttpClient) {

    const clientConfig = new AliYunClientConfig(
      "",
      "",
      "ecs.aliyuncs.com",
      "2014-05-26",
      "ecs",
      (regionId: string) => {
        if (regionId && regionId !== "cn-hangzhou") {
          return this.regionInfo[regionId]
        }
        // default
        return "ecs.cn-hangzhou.aliyuncs.com";
      })


    this.store.select(selectAccessKeyInfo).subscribe(data => {
      clientConfig.setAccessKeyId(data.accessKeyId)
      clientConfig.setAccessKeySecret(data.accessKeySecret)
      // 如果 ak 变化 重新初始化 client
      this.ecsClient = new AliYunClientService(httpClient, clientConfig)
    })

    this.ecsClient = new AliYunClientService(httpClient, clientConfig)

    const regionSubscribe = this.store.select(selectAllRegionInfo).subscribe((data: {
      RegionId: string,
      RegionEndpoint: string,
      LocalName: string
    }[]) => {
      if (data) {
        for (let i = 0; i < data.length; i++) {
          const region = data[i];
          this.regionInfo[region.RegionId] = region.RegionEndpoint
        }
      }
    })

    this.destroyRef.onDestroy(() => {
      regionSubscribe.unsubscribe()
    })
  }

  private destroyRef = inject(DestroyRef)


  private regionInfo: any = {}


  private ecsClient: AliYunClientService;

  // 全局默认参数
  private baseParam = {
    PageSize: 100
  }

  private mergeBaseParam(param: any) {
    return Object.assign({...this.baseParam}, param)
  }


  /**
   * 查询全地域 region 信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeRegions
   */
  public describeRegions(params?: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeRegions", params)
  }

  /**
   * 查询全地域可用区信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeZones
   */
  public describeZones(params?: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeZones", params)
  }

  /**
   * 查询指定地域的实例信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeInstances
   */
  public describeInstances(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeInstances", this.mergeBaseParam(params))
  }

  /**
   * 查询指定地域镜像信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeImages
   */
  public describeImages(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeImages", this.mergeBaseParam(params))
  }

  /**
   * 查询单个实例信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeInstanceAttribute
   */
  public describeInstanceAttribute(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeInstanceAttribute", params)
  }

  /**
   * 查询指定地域实例状态信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeInstancesFullStatus
   */
  public describeInstanceFullStatus(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeInstancesFullStatus", this.mergeBaseParam(params))
  }

  /**
   * 查询指定地域磁盘信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeDisks
   */
  public describeDisks(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeDisks", this.mergeBaseParam(params))
  }

  /**
   * 查询指定地域系统事件
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeInstanceHistoryEvents
   */
  public describeInstanceHistoryEvents(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeInstanceHistoryEvents", this.mergeBaseParam(params))
  }

  /**
   * 创建诊断报告
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/CreateDiagnosticReport
   */
  public createDiagnosticReport(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("CreateDiagnosticReport", params)
  }

  /**
   * 查询诊断报告
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeDiagnosticReports
   */
  public describeDiagnosticReports(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeDiagnosticReports", params)
  }

  /**
   * 查询诊断报告详情
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeDiagnosticReportAttributes
   */
  public describeDiagnosticReportAttributes(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeDiagnosticReportAttributes", params)
  }

  /**
   * 接收并授权执行事件操作
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/AcceptInquiredSystemEvent
   */
  public acceptInquiredSystemEvent(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("AcceptInquiredSystemEvent", params)
  }

  /**
   * 批量查询实例维护属性
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeInstanceMaintenanceAttributes
   */
  public describeInstanceMaintenanceAttributes(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeInstanceMaintenanceAttributes", params)
  }

  /**
   * 批量修改实例维护属性
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/ModifyInstanceMaintenanceAttributes
   */
  public modifyInstanceMaintenanceAttributes(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("ModifyInstanceMaintenanceAttributes", params)
  }

  /**
   * 查询诊断指标集
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeDiagnosticMetricSets
   */
  public describeDiagnosticMetricSets(params: BaseApiRequest) {
    const context = new HttpContext()
    // 查询用户诊断指标 error silent
    if (params && params['Type'] && params['Type'] === "User") {
      context.set(ERROR_SILENT, true)
    }
    return this.ecsClient.sendRequest("DescribeDiagnosticMetricSets", params, context)
  }

  /**
   * 创建诊断指标集
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/CreateDiagnosticMetricSet
   */
  public createDiagnosticMetricSets(params: BaseApiRequest) {
    return this.ecsClient.sendPostRequest("CreateDiagnosticMetricSet", params)
  }

  /**
   * 修改诊断指标集
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/ModifyDiagnosticMetricSet
   */
  public modifyDiagnosticMetricSets(params: BaseApiRequest) {
    return this.ecsClient.sendPostRequest("ModifyDiagnosticMetricSet", params)
  }

  /**
   * 删除诊断指标集
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DeleteDiagnosticMetricSets
   */
  public deleteDiagnosticMetricSets(params: BaseApiRequest) {
    return this.ecsClient.sendPostRequest("DeleteDiagnosticMetricSets", params)
  }

  /**
   * 查询诊断指标
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeDiagnosticMetrics
   */
  public describeDiagnosticMetrics(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeDiagnosticMetrics", params)
  }

  /**
   * 查询实例截图
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/GetInstanceScreenshot
   */
  public getInstanceScreenshot(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("GetInstanceScreenshot", params)
  }

  /**
   * 查询实例控制台输出
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/GetInstanceConsoleOutput
   */
  public getInstanceConsoleOutput(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("GetInstanceConsoleOutput", params)
  }

  /**
   * 查询云助手状态
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeCloudAssistantStatus
   */
  public describeCloudAssistantStatus(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeCloudAssistantStatus", params)
  }

  /**
   * 运行命令
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/RunCommand
   */
  public runCommand(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("RunCommand", params)
  }

  /**
   * 停止实例
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/StopInstance
   */
  public stopInstance(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("StopInstance", params)
  }

  /**
   * 查询实例监控信息
   * @param params
   * @link https://next.api.aliyun.com/api/Ecs/2014-05-26/DescribeInstanceMonitorData
   */
  public describeInstanceMonitorData(params: BaseApiRequest) {
    return this.ecsClient.sendRequest("DescribeInstanceMonitorData", params)
  }

}
