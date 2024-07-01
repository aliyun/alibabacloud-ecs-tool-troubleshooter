import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HealthStatusRoutingModule} from './health-status-routing.module';
import {NzSegmentedModule} from 'ng-zorro-antd/segmented';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {CardDirective} from "../../shared/directive/card.directive";
import {CopyTextDirective} from "../../shared/directive/copy-text.directive";
import {NgxEchartsModule} from "ngx-echarts";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {PanelTitleComponent} from "../../shared/components/panel-title/panel-title.component";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzInputModule} from "ng-zorro-antd/input";
import {HealthStatusComponent} from "./health-status/health-status.component";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {HealthStatusEffectService} from "./services/effects/health-status-effect.service";


@NgModule({
  declarations: [
    HealthStatusComponent,
  ],
  imports: [
    CommonModule,
    HealthStatusRoutingModule,
    NzSegmentedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature("home", {}),
    EffectsModule.forFeature([]),
    NzIconModule,
    PanelTitleComponent,
    CardDirective,
    CopyTextDirective,
    NgxEchartsModule,
    NzDatePickerModule,
    NzButtonModule,
    NzTabsModule,
    NzTableModule,
    NzDividerModule,
    NzSelectModule,
    NzTagModule,
    NzInputModule,
    NzGridModule,
    NzSpinModule,
    NzDropDownModule,
    NzEmptyModule,
  ],
  providers: [
    HealthStatusEffectService
  ]
})
export class HealthStatusModule {
}
