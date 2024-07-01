import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {APP_BASE_HREF, registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NgxEchartsModule} from 'ngx-echarts';
import {PageHeaderComponent} from './shared/components/page-header/page-header.component';
import {GlobalEffectService} from './shared/services/effects/global-effect.service';
import {NzMessageModule} from 'ng-zorro-antd/message';
import * as AllIcons from '@ant-design/icons-angular/icons';
import {NzWaterMarkModule} from 'ng-zorro-antd/water-mark';
import {ExceptionInterceptor} from './shared/services/interceptors/exception.interceptor';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {IconDefinition} from '@ant-design/icons-angular';
import {routerReducer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {
  accessKeyReducer,
  accessKeySettingVisibleReducer,
  globalSearchReducer,
  regionInfoReducer,
} from './ngrx/reducers/global.reducer';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {SidebarMenuComponent} from './shared/components/sidebar-menu/sidebar-menu.component';
import {menuDataReducer, menuSelectIndexReducer, menuVisibleReducer} from './ngrx/reducers/menu.reducrt';
import {StaticDataInterceptor} from "./shared/services/interceptors/static-data.interceptor";

registerLocaleData(zh);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])
const reducerMap = {
  router: routerReducer,
  globalSearch: globalSearchReducer,
  menuVisible: menuVisibleReducer,
  menuData: menuDataReducer,
  akSettingVisible: accessKeySettingVisibleReducer,
  menuSelectIndex: menuSelectIndexReducer,
  accessKeyInfo: accessKeyReducer,
  regionInfo: regionInfoReducer
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NzWaterMarkModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzIconModule.forRoot(icons),
    NzButtonModule,
    StoreModule.forRoot(reducerMap, {}),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([GlobalEffectService]),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    PageHeaderComponent,
    NzMessageModule,
    NzModalModule,
    NzDrawerModule,
    SidebarMenuComponent
  ],
  providers: [
    {provide: NZ_I18N, useValue: zh_CN},
    {provide: APP_BASE_HREF, useValue: "/"},
    {provide: HTTP_INTERCEPTORS, useClass: ExceptionInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: StaticDataInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
