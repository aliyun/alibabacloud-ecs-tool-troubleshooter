import {createSelector} from "@ngrx/store";
import {selectQueryParams, selectRouteParams} from "src/app/ngrx/selectors/global.select";
import {CustomerEventUrlParam} from "../../model/models";

/**
 * 获取解析URL中携带的参数
 */
export const selectCustomerEventUrlParam = createSelector(selectQueryParams, selectRouteParams, (state, routeParam) => {
  const result: CustomerEventUrlParam = {
    instanceId: '',
    startTime: '',
    endTime: '',
    eventStatus: [],
    eventType: [],
    regionId: ""
  }

  if (state) {
    const {resourceId, eventType, startTime, endTime, eventStatus, regionId} = state;

    if (resourceId && resourceId.trim()) {
      result.instanceId = resourceId.trim()
    }

    if (eventType && Array.isArray(eventType)) {
      eventType.forEach(item => {
        result.eventType.push(item.trim());
      })
    } else if (eventType && eventType.trim() && !Array.isArray(eventType)) {
      result.eventType.push(eventType.trim());
    }


    if (startTime && startTime.trim()) {
      result.startTime = startTime.trim()
    }
    if (endTime && endTime.trim()) {
      result.endTime = endTime.trim()
    }

    if (eventStatus && Array.isArray(eventStatus)) {
      eventStatus.forEach(item => {
        result.eventStatus.push(item.trim());
      })
    } else if (eventStatus && eventStatus.trim() && !Array.isArray(eventStatus)) {
      result.eventStatus.push(eventStatus.trim());
    }

    if (regionId && regionId.trim()) {
      result.regionId = regionId.trim()
    }

  }
  return result;
})
