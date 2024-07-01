/**
 * aliyun client config
 */
export class AliYunClientConfig {

  private accessKeyId: string;
  private accessKeySecret: string;
  private readonly endpoint: string;
  private readonly version: string;
  private readonly product: string;
  private readonly endpointResolve: (a: string) => string = (regionId: string) => {
    return this.endpoint
  };

  constructor(
    accessKeyId: string,
    accessKeySecret: string,
    endpoint: string,
    version: string,
    product: string,
    endpointResolve?: (a: string) => string
  ) {
    this.accessKeyId = accessKeyId;
    this.accessKeySecret = accessKeySecret;
    this.endpoint = endpoint;
    this.version = version;
    this.product = product;
    if (endpointResolve) {
      this.endpointResolve = endpointResolve
    }
  }

  setAccessKeyId(accessKeyId: string) {
    this.accessKeyId = accessKeyId;
  }

  setAccessKeySecret(accessKeySecret: string) {
    this.accessKeySecret = accessKeySecret;
  }

  getAccessKeyId(): string {
    return this.accessKeyId || "";
  }

  getAccessKeySecret(): string {
    return this.accessKeySecret || "";
  }

  getEndpoint(regionId: string): string {
    return this.endpointResolve(regionId) || this.endpoint;
  }

  getVersion(): string {
    return this.version;
  }

  getProduct(): string {
    return this.product;
  }

}
