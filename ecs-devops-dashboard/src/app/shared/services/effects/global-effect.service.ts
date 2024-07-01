import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType, ROOT_EFFECTS_INIT} from '@ngrx/effects';
import {
  changeAccessKeyAction,
  changeUrlSearchParamsAction,
  displayErrorDialogAction,
  displayErrorMessage,
  displayInfoMessage,
  displaySuccessMessage,
  displayWarningMessage,
  routerLinkAction,
} from '../../../ngrx/actions/global.action';
import {concatMap, EMPTY, from, of, tap, withLatestFrom} from 'rxjs';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Params, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {ErrorDialogComponent} from '../../components/error-dialog/error-dialog.component';
import {HttpErrorResponse} from '@angular/common/http';
import {UrlUtils} from 'src/app/utils/url.utils';
import {SignUtils} from "../../../utils/sign.utils";
import {GlobalConstant} from "../../../constants/constants";
import {selectCurrentUrlAndSearchParams} from "../../../ngrx/selectors/global.select";


@Injectable()
export class GlobalEffectService {

  constructor(
    private messageService: NzMessageService,
    private modalService: NzModalService,
    private actions: Actions,
  ) {
  }

  private router = inject(Router);
  private store = inject(Store);

  /**
   * 初始化
   */
  effectName$ = createEffect(() => {
    return this.actions.pipe(
      ofType(ROOT_EFFECTS_INIT),
      tap(() => {
        // 加载配置信息
        const info = window.localStorage.getItem(GlobalConstant.ACCESS_KEY_INFO_STORE_KEY);
        if (info) {
          let accessKeyInfo = {accessKeyId: null, accessKeySecret: null}
          try {
            accessKeyInfo = JSON.parse(SignUtils.base64Decode(info))
          } catch (e) {
            console.log(`parse store error`)
          }
          this.store.dispatch(changeAccessKeyAction(accessKeyInfo))
        }
      })
    );
  }, {dispatch: false});

  /**
   * 页面弹出message信息
   */
  effectShowMessage$ = createEffect(() => {
    return this.actions.pipe(
      ofType(displayInfoMessage, displayErrorMessage, displaySuccessMessage, displayWarningMessage),
      tap({
        next: param => {
          const {type, content} = param;
          switch (type) {
            case 'displayInfoMessage':
              this.messageService.info(content);
              break;
            case 'displayErrorMessage':
              this.messageService.error(content);
              break;
            case 'displaySuccessMessage':
              this.messageService.success(content);
              break;
            case 'displayWarningMessage':
              this.messageService.warning(content);
          }
        }
      })
    );
  }, {dispatch: false});

  /**
   * 弹出错误信息窗口
   */
  showErrorDialog$ = createEffect(() => {
    let modelRef: NzModalRef<unknown, unknown> | null;
    return this.actions.pipe(
      ofType(displayErrorDialogAction),
      tap(param => {
        const {error, clearAll = false} = param;
        if (clearAll) {
          this.modalService.closeAll();
        }
        if (!modelRef) {
          let title = "未知错误", width = 800;
          if (error instanceof HttpErrorResponse) {
            title = "访问错误"
            width = 650
            // unKnown Error host 不存在 不弹框输出到控制台提示
            if (error.statusText == "Unknown Error") {
              console.error(error)
              return;
            }
          }
          modelRef = this.modalService.error({
            nzTitle: title,
            nzContent: ErrorDialogComponent,
            nzWidth: width,
            nzFooter: null
          })
          const instance = modelRef.getContentComponent() as ErrorDialogComponent;
          if (instance) {
            instance.errorData = error;
          }
          const subscription = modelRef.afterClose.subscribe(() => {
            modelRef = null;
            subscription.unsubscribe();
          })
        }
      })
    )
  }, {dispatch: false})


  /**
   * 更新URL携带的参数
   */
  updateUrlSearchParams$ = createEffect(() => {
    return this.actions.pipe(
      ofType(changeUrlSearchParamsAction),
      concatMap(param => {
        /**
         * 如果同时发起多个更新操作，必须等上一个结束后才能进入
         */
        return of(param).pipe(
          withLatestFrom(this.store.select(selectCurrentUrlAndSearchParams)),
          concatMap(([updateSearchParams, currentSearchParams]) => {
            if (currentSearchParams && currentSearchParams.url) {
              const queryParams: Params = {...currentSearchParams.searchParams};
              if (updateSearchParams.searchParams && Object.keys(updateSearchParams.searchParams).length) {
                for (const key in updateSearchParams.searchParams) {
                  queryParams[key] = updateSearchParams.searchParams[key]
                }
              }
              const url = currentSearchParams.url;
              return from(this.router.navigate([url], {queryParams}));
            }
            return EMPTY
          })
        )
      })
    )
  }, {dispatch: false})


  /**
   * 路由跳转
   */
  routerLink$ = createEffect(() => {
    return this.actions.pipe(
      ofType(routerLinkAction),
      tap((param) => {
        const commands = Array.isArray(param.commands) ? param.commands : [param.commands];
        if (commands.every(item => !!item)) {
          if (param.openTab === true) {
            const urlTree = this.router.createUrlTree(commands, {queryParams: param.queryParams})
            UrlUtils.openWindow(urlTree);
          } else {
            if (param.queryParams) {
              this.router.navigate(commands, {queryParams: param.queryParams})
            } else {
              this.router.navigate(commands);
            }
          }
        }
      })
    )
  }, {dispatch: false})

  /**
   * ak 变更
   */
  accessKeyChange = createEffect(() => {
    return this.actions.pipe(
      ofType(changeAccessKeyAction),
      tap((param) => {
        // accessKey 设置了
        if (Object.keys(param).length > 0) {
          const {accessKeyId, accessKeySecret} = param
          window.localStorage.setItem(GlobalConstant.ACCESS_KEY_INFO_STORE_KEY, SignUtils.base64Encode(JSON.stringify({
            accessKeyId,
            accessKeySecret
          })))
        } else {
          // 没有设置 清除本地存储的内容
          window.localStorage.removeItem(GlobalConstant.ACCESS_KEY_INFO_STORE_KEY)
        }
      })
    )
  }, {dispatch: false})

}
