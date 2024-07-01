import { createReducer, on } from "@ngrx/store";
import {
  changeMenuSelectIndexAction,
  closeMenuAction,
  initializeMenuDataAction,
  openMenuAction,
} from "../actions/menu.action";
import { MenuGroup } from "src/app/shared/models/models";

export const initialMenuVisibleState = false;
export const initializeMenuDataState: Array<MenuGroup> = [];

export const initializeMenuSelectIndex = 0

export const menuSelectIndexReducer = createReducer(
  initializeMenuSelectIndex,
  on(changeMenuSelectIndexAction, (state, {index}) => {
    return index;
  })
)

export const menuVisibleReducer = createReducer(
    initialMenuVisibleState,
    on(openMenuAction, () => true),
    on(closeMenuAction, () => false),
)

export const menuDataReducer = createReducer(
  initializeMenuDataState,
  on(initializeMenuDataAction, (state, {data}) => {
    return [...state, ...data];
  })
)
