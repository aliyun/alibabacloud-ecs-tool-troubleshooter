import {createReducer, on} from "@ngrx/store";
import {
  changeAccessKeyAction,
  closeAccessKeySettingAction,
  globalSearchAction,
  initRegionInfoAction,
  openAccessKeySettingAction
} from "../actions/global.action";

export const initialAliUidState = '';

export const initialAccessKeySetting = false;


export const globalSearchReducer = createReducer(
  initialAliUidState,
  on(globalSearchAction, (state, searchParam) => {
    return searchParam.searchValue || "";
  })
)

/**
 * AccessKey reducer
 */
export const accessKeySettingVisibleReducer = createReducer(
  initialAccessKeySetting,
  on(openAccessKeySettingAction, () => true),
  on(closeAccessKeySettingAction, () => false)
)

export const accessKeyReducer = createReducer(
  {},
  on(changeAccessKeyAction, (state, {accessKeyId, accessKeySecret}) => {
    return {accessKeyId, accessKeySecret}
  })
)

export const regionInfoReducer = createReducer(
  {},
  on(initRegionInfoAction, (state, params) => {
    return params
  })
)
