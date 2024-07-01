import {TemplateRef} from "@angular/core";
import {Params} from "@angular/router";
import {createAction, props} from "@ngrx/store";

/**
 * 展示成功信息
 */
export const displaySuccessMessage = createAction("displaySuccessMessage", props<{
  content: string | TemplateRef<any>
}>())

/**
 * 展示错误信息
 */
export const displayErrorMessage = createAction("displayErrorMessage", props<{ content: string | TemplateRef<any> }>())

/**
 * 展示提示信息
 */
export const displayInfoMessage = createAction("displayInfoMessage", props<{ content: string | TemplateRef<any> }>())

/**
 * 展示高级信息
 */
export const displayWarningMessage = createAction("displayWarningMessage", props<{
  content: string | TemplateRef<any>
}>())

/**
 * 首页全文搜索
 */
export const globalSearchAction = createAction("globalResourceSearch", props<{
  searchValue: string | null,
  innerSearch?: boolean
}>())

/**
 * 弹出错误对话框
 */
export const displayErrorDialogAction = createAction("displayErrorDialogAction", props<{
  error: Error,
  clearAll?: boolean
}>())

/**
 * 更新URL参数
 */
export const changeUrlSearchParamsAction = createAction("changeUrlSearchParams", props<{
  searchParams?: { [key: string]: string }
}>())

/**
 * 页面跳转
 *
 */
export const routerLinkAction = createAction("routerLinkAction", props<{
  commands: Array<string> | string,
  queryParams?: Params,
  openTab?: boolean
}>())

/**
 * 开启ak/sk 配置界面
 */
export const openAccessKeySettingAction = createAction(("openAccessKeySetting"))

/**
 * 关闭 ak/sk 配置界面
 */
export const closeAccessKeySettingAction = createAction(("closeAccessKeySetting"))


/**
 * 修改 accessKey 信息
 */
export const changeAccessKeyAction = createAction("changeAccessKeyInfo", props<{
  accessKeyId: string | null,
  accessKeySecret: string | null
}>())

/**
 * 初始化region 信息
 */
export const initRegionInfoAction = createAction("initRegionInfoAction", props<{
  Region: { RegionId: string, RegionEndpoint: string, LocalName: string }[]
}>())
