import { createReducer, on } from "@ngrx/store";
import {
  closeMenuAction,
  initializeMenuDataAction,
  openMenuAction,
} from "../actions/menu.action";
import { MenuGroup } from "src/app/shared/models/models";

export const initialMenuVisibleState = false;
export const initializeMenuDataState: Array<MenuGroup> = [];


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
