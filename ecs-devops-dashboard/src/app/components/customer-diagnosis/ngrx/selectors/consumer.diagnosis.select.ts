import {createSelector} from "@ngrx/store";
import {selectQueryParams, selectRouteParams} from "src/app/ngrx/selectors/global.select";

/**
 * 获取解析URL中携带的参数
 */
export const selectCustomerDiagnoseUrlParam = createSelector(selectQueryParams, selectRouteParams, (state, routeParam) => {
  const {resourceId, regionId, operation, startTime, endTime} = state
  return {
    regionId: regionId,
    resourceId: resourceId,
    startTime: startTime,
    endTime: endTime,
    operation: operation
  };
})
