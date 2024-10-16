import {Component, inject, OnInit} from '@angular/core';
import {selectCurrentUrlAndSearchParams} from "../../../ngrx/selectors/global.select";
import {Store} from "@ngrx/store";
import {routerLinkAction} from "../../../ngrx/actions/global.action";

@Component({
  selector: 'ops-instance-diagnosis-header',
  templateUrl: './instance-diagnosis-header.component.html',
  styleUrls: ['./instance-diagnosis-header.component.less']
})
export class InstanceDiagnosisHeaderComponent implements OnInit {

  activeIndex = 0;

  private store = inject(Store)

  tabs: any[] = [
    {
      label: '实例问题排查',
      value: '/customer-diagnosis'
    },
    {
      label: '历史诊断查询',
      value: '/customer-diagnosis/list'
    },
    {
      label: '批量任务查询',
      value: '/customer-diagnosis/task-list'
    }
  ]

  regionId = "cn-hangzhou"

  ngOnInit(): void {
    this.store.select(selectCurrentUrlAndSearchParams).subscribe(res => {
      this.handlerUrl(res.url)
      this.regionId = res.searchParams['regionId'] || "cn-hangzhou"
    })
  }

  handlerUrl(data: any) {
    for (let i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].value === data) {
        this.activeIndex = i
        return
      }
    }
  }

  tabClick(index: number) {
    if (this.activeIndex !== index) {
      this.activeIndex = index
      const split = this.tabs[index].value.split('/').filter((item: any) => item !== '');
      this.store.dispatch(routerLinkAction({
        commands: split,
        queryParams: {
          regionId: this.regionId
        }
      }))
    }
  }


}
