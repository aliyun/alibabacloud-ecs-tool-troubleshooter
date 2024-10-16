import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {HttpClient, HttpContext} from "@angular/common/http";
import {AliYunClientConfig} from "../services/config/aliyun-client-config";
import {selectAccessKeyInfo} from "../ngrx/selectors/global.select";
import {AliYunClientService} from "../services/aliyun-client.service";
import {BaseApiRequest, ERROR_SILENT} from "../shared/models/models";


@Injectable({
  providedIn: "root"
})
export class OosApiService {

  private store = inject(Store)

  constructor(httpClient: HttpClient) {

    const clientConfig = new AliYunClientConfig(
      "",
      "",
      "oos.cn-hangzhou.aliyuncs.com",
      "2019-06-01",
      "oos",
      (regionId: string) => {
        if (regionId) {
          return `oos.${regionId}.aliyuncs.com`
        }
        return "oos.cn-hangzhou.aliyuncs.com";
      })


    this.store.select(selectAccessKeyInfo).subscribe(data => {
      clientConfig.setAccessKeyId(data.accessKeyId)
      clientConfig.setAccessKeySecret(data.accessKeySecret)
      // 如果 ak 变化 重新初始化 client
      this.client = new AliYunClientService(httpClient, clientConfig)
    })

    this.client = new AliYunClientService(httpClient, clientConfig)

  }


  private regionInfo: any = {}


  private client: AliYunClientService;


  public describeRegions(params?: BaseApiRequest) {
    return this.client.sendRequest("DescribeRegions", params)
  }

  /**
   * 执行模版程序
   * @param param
   */
  public startExecution(param: BaseApiRequest) {
    return this.client.sendRequest("StartExecution", param)
  }

  public updateExecution(param: BaseApiRequest) {
    return this.client.sendRequest("UpdateExecution", param)
  }

  public listExecutions(params?: BaseApiRequest) {
    return this.client.sendRequest("ListExecutions", params)
  }

  public listTaskExecutions(params?: BaseApiRequest) {
    return this.client.sendRequest("ListTaskExecutions", params)
  }

  public cancelExecution(params?: BaseApiRequest) {
    return this.client.sendRequest("CancelExecution", params)
  }

  public deleteExecutions(params?: BaseApiRequest) {
    return this.client.sendRequest("DeleteExecutions", params)
  }

  public triggerExecution(params?: BaseApiRequest) {
    return this.client.sendRequest("TriggerExecution", params)
  }


  public listExecutionLogs(params?: BaseApiRequest) {
    return this.client.sendRequest("ListExecutionLogs", params)
  }

  public generateExecutionPolicy(params?: BaseApiRequest) {
    const content = new HttpContext()
    content.set(ERROR_SILENT, true)
    return this.client.sendRequest("GenerateExecutionPolicy", params, content)
  }
}
