import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {akSettingVisible, selectAccessKeyInfo, selectUrl} from 'src/app/ngrx/selectors/global.select';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzIconModule, NzIconService} from 'ng-zorro-antd/icon';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {createSelector, Store} from '@ngrx/store';
import {map} from 'rxjs';
import {NzInputModule} from 'ng-zorro-antd/input';
import {openMenuAction} from 'src/app/ngrx/actions/menu.action';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {returnIcon} from '../../constants/icon.constants';
import {OverlayModule} from '@angular/cdk/overlay'
import {SearchBlockComponent} from '../search-block/search-block.component';
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {
  changeAccessKeyAction,
  closeAccessKeySettingAction, displayWarningMessage,
  openAccessKeySettingAction
} from "../../../ngrx/actions/global.action";

@Component({
  selector: 'ops-page-header',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzDividerModule, OverlayModule, NzBadgeModule, SearchBlockComponent, NzSpaceModule, NzDropDownModule, FormsModule, NgOptimizedImage, RouterModule, NzAvatarModule, NzInputModule, NzIconModule, NzDrawerModule, NzFormModule, NzButtonModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent implements OnInit {

  private store = inject(Store);

  private iconService = inject(NzIconService);

  public showMenuIcon = this.store.select(selectUrl).pipe(
    map(url => {
      return url !== '/';
    })
  )

  public settingVisible = this.store.select(akSettingVisible)

  public ak = ''
  public sk = ''

  ngOnInit(): void {
    this.iconService.addIconLiteral('ops:return', returnIcon);
  }


  /**
   * 侧边菜单栏展示
   */
  openMenu() {
    const subscription = this.store.select(createSelector(selectUrl, (param) => {
      return !(!param || param == "/");
    })).subscribe(value => {
      Promise.resolve().then(() => subscription.unsubscribe());
      if (value) {
        this.store.dispatch(openMenuAction())
      }
    })
  }


  settingOpen() {
    this.ak = ""
    this.sk = ""

    this.store.select(selectAccessKeyInfo).subscribe(data=>{
      this.ak = data.accessKeyId
      this.sk = data.accessKeySecret
    })
    this.store.dispatch(openAccessKeySettingAction())
  }

  settingClose() {
    this.store.dispatch(closeAccessKeySettingAction())
  }

  settingSave() {
    // 校验 ak sk 是否都存在
    if (!this.ak && this.sk){
      // 提示 ak 不能为空
      this.store.dispatch(displayWarningMessage({content: "accessKeyId 不能为空"}))
      return
    }
    if (!this.sk && this.ak){
      // 提示 sk 不能为空
      this.store.dispatch(displayWarningMessage({content: "accessKeySecret 不能为空"}))
      return
    }
    this.store.dispatch(changeAccessKeyAction({accessKeyId: this.ak, accessKeySecret: this.sk}))
    this.store.dispatch(closeAccessKeySettingAction())
  }

}
