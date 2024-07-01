import { createFeatureSelector } from "@ngrx/store";
import { MenuGroup } from "src/app/shared/models/models";

export const selectMenuVisible = createFeatureSelector<boolean>("menuVisible");

export const selectMenuData = createFeatureSelector<Array<MenuGroup>>("menuData");

export const selectMenuIndex = createFeatureSelector<number>("menuSelectIndex")
