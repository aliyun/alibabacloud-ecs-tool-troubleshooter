import {HttpClient, HttpContext} from "@angular/common/http";
import {DateUtils} from "../utils/date.utils";
import {SignUtils} from "../utils/sign.utils";
import {SystemUtil} from "../utils/utils";
import {EXT_PARAM} from "../shared/models/models";
import {AliYunClientConfig} from "./config/aliyun-client-config";

/**
 * aliyun sdk http client
 */
export class AliYunClientService {

  constructor(
    private httpClient: HttpClient,
    private config: AliYunClientConfig) {

  }

  private readonly SignatureAlgorithm = "ACS3-HMAC-SHA256"

  public sendPostRequest(action: string, params: any, content?: HttpContext) {
    return this.request("POST", action, params, content)
  }

  /**
   * 调用 sdk
   * @param action
   * @param params
   * @param content
   * @private
   */
  public sendRequest(action: string, params: any, content?: HttpContext) {
    return this.request("GET", action, params, content)
  }

  private request(method: string, action: string, params: any, content?: HttpContext) {
    // 处理 request
    if (!params) {
      params = {}
    }
    // 转换参数
    params = this.transformObject(params)

    // 选择 endpoint
    const regionId = params ? params['RegionId'] : null
    // 不存在 删除regionId
    if (!regionId) {
      delete params['RegionId']
    }
    const endpoint = this.selectEndpoint(regionId);

    let request: any = {
      queryParam: "",
      body: params,
      bodyStr: JSON.stringify(params)
    }
    if (method == "GET") {
      request = {
        queryParam: params,
        body: null,
        bodyStr: ""
      }
    }

    const requestHeaders: any = {
      "x-acs-action": action,
      "x-acs-version": this.config.getVersion(),
      "x-acs-signature-nonce": SystemUtil.generateRandomString(20),
      "x-acs-date": DateUtils.toUTCString(new Date()),
      "x-acs-content-sha256": SignUtils.hashSha256(request.bodyStr)
    }

    requestHeaders['Authorization'] = this.generatorAuthorization(method, request, {
      ...requestHeaders,
      host: endpoint
    })

    if (content == null) {
      content = new HttpContext()
    }
    content.set(EXT_PARAM, params)
    return this.httpClient.request(method, `https://${endpoint}/`, {
      headers: requestHeaders,
      params: request.queryParam,
      body: request.body,
      context: content
    })
  }


  private transformObject(obj: any) {
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        const value = obj[key];
        delete obj[key];
        value.forEach((val: any, index: any) => {
          const newKey = `${key}.${index + 1}`;
          if (typeof val === 'object') {
            Object.keys(val).forEach(_key => {
              obj[`${newKey}.${_key}`] = val[_key];
            })
          } else if (typeof val === 'string') {
            obj[newKey] = val.trim();
          } else {
            obj[newKey] = val;
          }
        });
      }
    }
    return obj;
  }

  private selectEndpoint(regionId: string) {
    return this.config.getEndpoint(regionId)
  }

  private generatorAuthorization(method: string, request: any, headers: any) {
    const canonicalQueryString = this.canonicalQueryString(request.queryParam);
    const canonicalHeaders = this.canonicalHeaders(headers)
    const signedHeaders = this.signedHeaders(headers);
    const hashedRequestPayload = SignUtils.hashSha256(request.bodyStr);
    const canonicalRequest = this.canonicalRequest(method, "/", canonicalQueryString, canonicalHeaders, signedHeaders, hashedRequestPayload);
    const strToSign = this.SignatureAlgorithm + '\n' + SignUtils.hashSha256(canonicalRequest)
    const signature = SignUtils.hmacSHA256(strToSign, this.config.getAccessKeySecret())

    return this.SignatureAlgorithm + " Credential=" + this.config.getAccessKeyId() + ",SignedHeaders=" + signedHeaders + ",Signature=" + signature
  }

  private canonicalRequest(method: string, uriPath: string, canonicalQueryString: string, canonicalHeaders: string, signedHeaders: string, hashedRequestPayload: string) {
    return method + '\n' +    //http方法名，全大写
      uriPath + '\n' +         //规范化URI
      canonicalQueryString + '\n' + //规范化查询字符串  get 参数      xxx=xxx
      canonicalHeaders + '\n' +     //规范化消息头    api 公共头参数   x-acs-action:RunInstances
      signedHeaders + '\n' +        //已签名消息头    签名头           host;x-acs-action;xxx;
      hashedRequestPayload          // get/post 参数的hash get 为空
  }

  /**
   * 构建规范的查询参数str
   * @param param
   * @private
   */
  private canonicalQueryString(param: any) {
    const keys = Object.keys(param)
    keys.sort()
    let canonicalQueryString = ""
    if (param) {
      keys.forEach(key => {
        canonicalQueryString += "&" + encodeURIComponent(key) + "="
        if (typeof param[key] === "string" && param[key].indexOf("*")) {
          // fix * sign
          canonicalQueryString += encodeURIComponent(param[key])
            .replaceAll("*", "%2A")
        } else {
          canonicalQueryString += encodeURIComponent(param[key])
        }
      })
    }
    return canonicalQueryString.replace(/^&/, "");
  }

  private canonicalHeaders(headers: any) {
    let canonicalHeaders = ""
    Object.keys(headers).sort().forEach(key => {
      canonicalHeaders += key + ":" + headers[key] + "\n"
    })
    return canonicalHeaders
  }

  private signedHeaders(headers: any) {
    let signedHeaders = ""
    Object.keys(headers).sort().forEach(key => {
      signedHeaders += key + ";"
    })
    return signedHeaders.replace(/;$/, "")
  }

}
