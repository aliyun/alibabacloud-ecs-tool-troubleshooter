import {getRouterSelectors} from "@ngrx/router-store";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {GlobalConstant} from "../../constants/constants";
import {SignUtils} from "../../utils/sign.utils";

export const {
  selectCurrentRoute,
  selectQueryParams,
  selectUrl,
  selectRouteParams
} = getRouterSelectors();


/**
 * 获取当前路由信息， url， 参数、
 */
export const selectCurrentUrlAndSearchParams = createSelector(selectQueryParams, selectUrl, selectCurrentRoute, (searchParams, url, currentRoute) => {
  // 去除掉url中的参数
  if (url && url.indexOf("?") != -1) {
    url = url.substring(0, url.indexOf("?"))
  }
  return {url, searchParams}
});

export const akSettingVisible = createFeatureSelector("akSettingVisible")

export const selectAccessKeyInfo = createSelector(createFeatureSelector("accessKeyInfo"), (state: {
  accessKeyId: string,
  accessKeySecret: string
}) => {

  // 存在值 直接使用
  if (state.accessKeyId && state.accessKeySecret) {
    return state
  }
  // 如果 state 为空对象 则 尝试从 localStorage 里获取
  const info = window.localStorage.getItem(GlobalConstant.ACCESS_KEY_INFO_STORE_KEY);
  if (info) {
    try {
      return JSON.parse(SignUtils.base64Decode(info));
    } catch (e) {
      console.error(e)
    }
  }
  return state
})

export const selectAccessKeyExists = createSelector(selectAccessKeyInfo, (state: {
  accessKeyId: string,
  accessKeySecret: string
}) => {
  return !!(state.accessKeyId && state.accessKeySecret);
})

/**
 * 返回 筛选后关注的 region 信息
 */
export const selectRegionInfo = createSelector(createFeatureSelector("regionInfo"), createFeatureSelector("selectedRegionInfo"), (param: any, selectedRegion: any) => {

  let regionInfo = []
  if (param && param['Region']) {
    regionInfo = param['Region']
  }
  let selectedRegionData: any[] = []
  if (selectedRegion && selectedRegion['selectedRegion']) {
    selectedRegionData = selectedRegion['selectedRegion']
  }

  regionInfo = regionInfo.filter((item: any) => {
    if (selectedRegionData.length === 0) {
      return true
    }
    // 包含 则返回
    return selectedRegionData.includes(item.RegionId);
  })

  return regionInfo
})

/**
 * 返回全部地域信息
 */
export const selectAllRegionInfo = createSelector(createFeatureSelector("regionInfo"), (param: any) => {
  if (param && param['Region']) {
    return param['Region']
  }
  return []
})

export const selectFocusRegionInfo = createSelector(createFeatureSelector("selectedRegionInfo"), (param: any) => {
  if (param) {
    return param['selectedRegion'] || []
  }
  return []
})

