import {JsonPipe, NgClass, NgFor, NgIf, NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {Store} from '@ngrx/store';
import {closeMenuAction} from 'src/app/ngrx/actions/menu.action';
import {MenuGroup, MenuItem} from '../../models/models';
import {selectMenuData} from 'src/app/ngrx/selectors/menu.selector';
import {Subscription} from 'rxjs';
import {routerLinkAction} from 'src/app/ngrx/actions/global.action';
import {selectCurrentUrlAndSearchParams} from "../../../ngrx/selectors/global.select";

@Component({
  selector: 'ops-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.less'],
  imports: [NzIconModule, NgFor, NgIf, NgTemplateOutlet, NzInputModule, NgClass, NzEmptyModule, JsonPipe],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarMenuComponent implements OnInit, OnDestroy {

  constructor(private store: Store) {
  }

  public menuData: Array<MenuGroup> = []
  activeUrl = ''
  public childrenMenu?: Array<MenuItem>;

  private subscription = new Subscription();

  ngOnInit(): void {

    this.subscription.add(this.store.select(selectMenuData).subscribe(menuData => {
      this.menuData = menuData;
    }));

    this.store.select(selectCurrentUrlAndSearchParams).subscribe(res => {
      this.activeUrl = res.url
    })

  }

  isActiveUrl(url: any) {
    if (this.activeUrl === undefined) {
      return false;
    }
    if (url === undefined) {
      return false
    }
    return this.activeUrl.indexOf(url) > -1;
  }

  closeEvent() {
    this.store.dispatch(closeMenuAction());
  }

  linkToPageByParentPage(param: MenuGroup, index: number) {
    if (param && param.isLeaf) {
      const path = param.path;
      if (path) {
        const queryParams = param.queryParams;
        this.store.dispatch(routerLinkAction({commands: [path], queryParams: {...queryParams}}))
      }
    }
    this.closeEvent();
  }

  linkToPageByChildPage(param: MenuItem) {
    if (param && param.isLeaf) {
      const path = param.path;
      if (path) {
        const queryParams = param.queryParams;
        let newParam = {};
        if (param.callBack && typeof param.callBack == 'function') {
          newParam = param.callBack();
        }
        this.store.dispatch(routerLinkAction({commands: [path], queryParams: {...queryParams, ...newParam}}))
      }
    }
    this.closeEvent();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
