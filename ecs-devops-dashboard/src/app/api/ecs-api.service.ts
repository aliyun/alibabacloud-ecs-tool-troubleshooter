import {DestroyRef, inject, Injectable} from "@angular/core";
import {BaseApiRequest} from "../shared/models/models";
import {HttpClient} from "@angular/common/http";
import {AliYunClientService} from "../services/aliyun-client.service";
import {Store} from "@ngrx/store";
import {AliYunClientConfig} from "../services/config/aliyun-client-config";
import {selectAccessKeyInfo, selectRegionInfo} from "../ngrx/selectors/global.select";


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
        if (regionId) {
          return this.regionInfo[regionId]
        }
        return "ecs.aliyuncs.com";
      })


    this.store.select(selectAccessKeyInfo).subscribe(data => {
      clientConfig.setAccessKeyId(data.accessKeyId)
      clientConfig.setAccessKeySecret(data.accessKeySecret)
      // 如果 ak 变化 重新初始化 client
      this.ecsClient = new AliYunClientService(httpClient, clientConfig)
    })

    this.ecsClient = new AliYunClientService(httpClient, clientConfig)

    const regionSubscribe = this.store.select(selectRegionInfo).subscribe((data: {
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


}
