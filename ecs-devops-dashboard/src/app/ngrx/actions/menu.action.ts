import {createAction, props} from "@ngrx/store";
import {MenuGroup} from "src/app/shared/models/models";

/**
 * 关闭菜单
 */
export const closeMenuAction = createAction("closeMenuAction")

/**
 * 打开菜单
 */
export const openMenuAction = createAction("openMenuAction")

/**
 * 初始化菜单数据
 */
export const initializeMenuDataAction = createAction("initializeMenuDataAction", props<{ data: Array<MenuGroup> }>())

/**
 * 改变侧边菜单索引
 */
export const changeMenuSelectIndexAction = createAction("changeMenuSelectIndex", props<{ index: number }>())
