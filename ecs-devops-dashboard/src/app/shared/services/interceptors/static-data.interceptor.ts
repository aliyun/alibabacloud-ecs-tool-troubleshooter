import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {inject, Injectable, OnDestroy} from "@angular/core";
import {Store} from "@ngrx/store";
import {selectAccessKeyInfo} from "../../../ngrx/selectors/global.select";
import {GlobalStaticDataService} from "../../../static/global-static-data.service";
import {EXT_PARAM} from "../../models/models";


/**
 * api 拦截器 返回静态数据
 */
@Injectable()
export class StaticDataInterceptor implements HttpInterceptor, OnDestroy {

  private accessKeyIsExists = false
  private store = inject(Store)
  private globalStaticDataService = inject(GlobalStaticDataService)

  accessKeyInfoSubscription = this.store.select(selectAccessKeyInfo).subscribe(data => {
    this.accessKeyIsExists = !!(data && data.accessKeyId && data.accessKeySecret);
  })


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.accessKeyIsExists) {
      return next.handle(req)
    }
    // ak无配置 访问静态数据
    const actionName = req.headers.get("x-acs-action");
    const extParam = req.context.get(EXT_PARAM);
    return this.globalStaticDataService.forward({
      action: actionName,
      params: extParam
    })
  }


  ngOnDestroy(): void {
    this.accessKeyInfoSubscription.unsubscribe()
  }

}
