import {AliYunClientService} from "../services/aliyun-client.service";
import {HttpClient} from "@angular/common/http";
import {selectAccessKeyInfo} from "../ngrx/selectors/global.select";
import {inject, Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import {AliYunClientConfig} from "../services/config/aliyun-client-config";
import {BaseApiRequest} from "../shared/models/models";


/**
 * 云监控 api
 */
@Injectable({
  providedIn: "root"
})
export class CmsApiService {

  private store = inject(Store)

  constructor(httpClient: HttpClient) {
    // client 配置
    const clientConfig = new AliYunClientConfig(
      "",
      "",
      "metrics.aliyuncs.com",
      "2019-01-01",
      "metrics",
      (regionId: string) => {
        if (regionId) {
          return `metrics.${regionId}.aliyuncs.com`
        }
        return "metrics.aliyuncs.com";
      })


    this.store.select(selectAccessKeyInfo).subscribe(data => {
      clientConfig.setAccessKeyId(data.accessKeyId)
      clientConfig.setAccessKeySecret(data.accessKeySecret)
      // 如果 ak 变化 重新初始化 client
      this.client = new AliYunClientService(httpClient, clientConfig)
    })

    this.client = new AliYunClientService(httpClient, clientConfig)

  }

  private client: AliYunClientService;


  public describeSystemEventHistogram(param: BaseApiRequest){
    return this.client.sendRequest("DescribeSystemEventHistogram", param)
  }


}
