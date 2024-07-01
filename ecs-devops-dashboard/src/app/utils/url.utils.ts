import {UrlTree} from "@angular/router";

export class UrlUtils {

  /**
   * 打开一个新的Tab页
   * @param urlTree
   */
  public static openWindow(urlTree: UrlTree) {
    if (!urlTree) {
      Error("urlTree can not empty")
    }
    let url = window.location.origin + window.location.pathname + "#";
    if (url) {
      if (url.lastIndexOf("/") === (url.length - 1)) {
        url = url.substring(0, url.length - 1)
      }
      window.open(`${url}${urlTree.toString()}`);
    }
  }

}
