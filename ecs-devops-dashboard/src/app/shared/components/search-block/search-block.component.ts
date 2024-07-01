import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, distinctUntilChanged, Observable, of, Subscription} from 'rxjs';
import {selectMenuData} from 'src/app/ngrx/selectors/menu.selector';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {SystemUtil} from 'src/app/utils/utils';
import {Store} from '@ngrx/store';
import {routerLinkAction} from 'src/app/ngrx/actions/global.action';

@Component({
  selector: 'ops-search-block',
  templateUrl: './search-block.component.html',
  styleUrls: ['./search-block.component.less'],
  standalone: true,
  imports: [CommonModule, NzEmptyModule]
})
export class SearchBlockComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private instancePageIdList = [10, 12];
  private subscription?: Subscription;
  public model: { all: Array<any> } = {
    all: []
  }
  public showLeft = false;

  @Input() searchInput: Observable<string> = of("");

  ngOnInit(): void {

    this.subscription = combineLatest([this.store.select(selectMenuData), this.searchInput.pipe(distinctUntilChanged())]).subscribe(([menuData, searchValue]) => {
      const all = new Array<any>();
      for (const menu of menuData) {
        if (menu.isLeaf) {
          all.push({
            id: menu.id,
            title: menu.title,
            path: menu.path,
            queryParams: {...menu.queryParams},
            callBack: menu.callBack
          })
        } else if (Array.isArray(menu.children)) {
          menu.children.forEach((childMenu: any) => {
            const {id, title, path, queryParams, callBack} = childMenu;
            all.push({id, title, path, queryParams: {...queryParams}, callBack})
          })
        }
      }
      this.model.all = all;
    });
  }


  navigate(param: any) {
    if (param) {
      const pageId = param.id;
      const pageUrl = param.path;
      const subscription = this.searchInput.subscribe(searchValue => {
        Promise.resolve().then(() => subscription.unsubscribe())

        const commands = new Array<string>();
        let newParam = {}

        const array = pageUrl.split("/").filter(Boolean);
        array.forEach((item: string) => {
          commands.push(item)
        })
        if (param.callBack && typeof param.callBack == 'function') {
          newParam = param.callBack();
        }
        const queryParams = {...param.queryParams, ...newParam}

        if (searchValue && searchValue.trim()) {
          const value = searchValue.trim();
          // 实例诊断页面 事件页面 带实例id 跳转
          if (SystemUtil.isVm(value) && this.instancePageIdList.includes(pageId)) {
            queryParams.resourceId = value
          }
          this.store.dispatch(routerLinkAction({commands: [pageUrl], queryParams, openTab: true}))
          return;
        } else {
          // 没有搜索值直接跳转 目标页面
          this.store.dispatch(routerLinkAction({commands, queryParams, openTab: false}))
          return;
        }
      })
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
