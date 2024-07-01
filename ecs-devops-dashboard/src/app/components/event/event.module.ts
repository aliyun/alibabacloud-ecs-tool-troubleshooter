import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventRoutingModule} from './event-routing.module';
import {CustomerEventComponent} from './customer-event/customer-event.component';
import {HttpClientModule} from "@angular/common/http";
import {NgxEchartsModule} from "ngx-echarts";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {CardDirective} from "../../shared/directive/card.directive";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {EmptyEchartsDirective} from "../../shared/directive/empty-echarts.directive";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzListModule} from "ng-zorro-antd/list";
import {NzDividerModule} from "ng-zorro-antd/divider";


@NgModule({
  declarations: [
    CustomerEventComponent
  ],
  imports: [
    CommonModule,
    EventRoutingModule,
    HttpClientModule,
    NgxEchartsModule,
    FormsModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzIconModule,
    NzButtonModule,
    CardDirective,
    NzTableModule,
    NzSwitchModule,
    NzInputModule,
    NzSpinModule,
    NzGridModule,
    NzCardModule,
    NzDropDownModule,
    NzPopoverModule,
    EmptyEchartsDirective,
    NzDrawerModule,
    NzListModule,
    NzDividerModule
  ],
  providers: []
})
export class EventModule {
}
