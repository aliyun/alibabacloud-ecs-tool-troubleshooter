import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {displayErrorDialogAction} from 'src/app/ngrx/actions/global.action';
import {ERROR_SILENT} from '../../models/models';
import {Observable, tap, timeout, TimeoutError} from 'rxjs';
import {Store} from '@ngrx/store';

/**
 * 接口请求发生错误时，该拦截器自动拦截异常，并根据请求上下文所设置( ERROR_SILENT )的参数，显示异常信息弹窗
 *
 * ERROR_SILENT 设置为true， 则不弹出异常信息，即使接口请求异常
 *
 */
@Injectable()
export class ExceptionInterceptor implements HttpInterceptor {

  private store = inject(Store);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const errorSilent = request.context.get(ERROR_SILENT);
    return next.handle(request).pipe(
      timeout(30000),
      tap({
        error: error => {
          if (error instanceof TimeoutError) {
            error = new HttpErrorResponse({
              status: 408,
              statusText: "request timeout",
              url: request.url,
            })
          }
          if (!errorSilent) {
            this.store.dispatch(displayErrorDialogAction({error, clearAll: false}))
          }
        }
      })
    );
  }
}
