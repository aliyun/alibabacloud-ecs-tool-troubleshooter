import {Component, inject, isDevMode, OnInit, Renderer2, RendererStyleFlags2,} from '@angular/core';
import {Store} from '@ngrx/store';
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {selectMenuVisible} from './ngrx/selectors/menu.selector';
import {closeMenuAction} from './ngrx/actions/menu.action';
import {initRegionInfoAction} from './ngrx/actions/global.action';
import {EcsApiService} from "./api/ecs-api.service";
import {selectAccessKeyExists} from "./ngrx/selectors/global.select";

@Component({
  selector: 'ops-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {

  public title = inject(Title);
  private store = inject(Store);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  public waterContent = "阿里云ECS可观测平台";
  public menuVisible = this.store.select(selectMenuVisible)

  private ecsApiService = inject(EcsApiService)

  ngOnInit(): void {
    this.initRegionInfos()
    this.initializeFavicon();
    this.initializeBodyStyle();
    this.initializeTitle();
    this.initializeWaterContent();
  }

  initializeWaterContent() {
    this.store.select(selectAccessKeyExists).subscribe(data => {
      if (data) {
        this.waterContent = "阿里云ECS可观测平台"
      } else {
        // ak 不存在
        this.waterContent = "阿里云ECS可观测平台-模拟数据";
      }
    })
  }

  initializeTitle() {
    this.title.setTitle("阿里云ECS可观测平台");
  }

  initializeBodyStyle() {
    if (this.document && this.document.body) {
      this.renderer.setStyle(this.document.body, 'background-color', '#f9feffd4', RendererStyleFlags2.DashCase);
      this.renderer.setStyle(this.document.body, 'padding-block-start', '55px', RendererStyleFlags2.DashCase);
      this.renderer.setStyle(this.document.body, 'width', 'clamp(1280px, 100%, 100vw)', RendererStyleFlags2.DashCase);
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden', RendererStyleFlags2.DashCase);
      this.renderer.setStyle(this.document.body, 'overflow-x', 'auto', RendererStyleFlags2.DashCase);
      // this.renderer.setStyle(this.document.body, "font-family", `"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",SimSun,sans-serif;"`)
    }
  }

  initializeFavicon() {
    if (!isDevMode()) {
      const link = this.document.head.querySelector("link[rel~='icon']");
      const faviconUrl = 'https://g.alicdn.com/aliyun/console/1.5.21/styles/images/favicon.ico';
      if (link) {
        this.renderer.setAttribute(link, "href", faviconUrl);
      } else {
        const childLink = this.document.createElement("link");
        this.renderer.setAttribute(childLink, "rel", "icon")
        this.renderer.setAttribute(childLink, "href", faviconUrl);
        this.renderer.appendChild(this.document.head, childLink);
      }
    }
  }

  closeMenu() {
    this.store.dispatch(closeMenuAction())
  }

  private initRegionInfos() {
    this.ecsApiService.describeRegions().subscribe((data: any) => {
      this.store.dispatch(initRegionInfoAction(data['Regions']))
    })
  }
}
