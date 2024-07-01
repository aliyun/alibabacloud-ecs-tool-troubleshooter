import {HttpContextToken} from "@angular/common/http";


export const EXT_PARAM = new HttpContextToken((): any => {
  return {}
})

export const ERROR_SILENT = new HttpContextToken(() => false);

export interface MenuItem {
  id: number
  title: string;
  isLeaf: boolean;
  path: string;
  queryParams: { [key: string]: any };
  isCollect: boolean;
  callBack?: () => { [key: string]: any };
}

export interface MenuGroup {
  id: number
  title: string;
  isLeaf: boolean;
  path?: string;
  queryParams?: { [key: string]: any };
  callBack?: () => { [key: string]: any };
  iconType: string;
  children: Array<MenuItem>;
}

/**
 * 通用的api 请求类型
 */
export interface BaseApiRequest {
  RegionId: string | null;

  [key: string]: any
}
