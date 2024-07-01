import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {DisplayHomeComponent} from './display-home/display-home.component';
import {NzSegmentedModule} from 'ng-zorro-antd/segmented';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {CardDirective} from 'src/app/shared/directive/card.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PanelTitleComponent} from 'src/app/shared/components/panel-title/panel-title.component';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NgxEchartsModule} from 'ngx-echarts';
import {CopyTextDirective} from 'src/app/shared/directive/copy-text.directive';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzPopoverModule} from 'ng-zorro-antd/popover';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {EmptyEchartsDirective} from 'src/app/shared/directive/empty-echarts.directive';
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {HealthStatusDescPipe} from "../../shared/pipe/health-status-desc.pipe";
import {InstanceStatusDescPipe} from "../../shared/pipe/instance-status-desc.pipe";

@NgModule({
  declarations: [
    DisplayHomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NzSegmentedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature("home", {}),
    EffectsModule.forFeature([]),
    PanelTitleComponent,
    CardDirective,
    NzIconModule,
    NzTableModule,
    NgxEchartsModule,
    CopyTextDirective,
    NzEmptyModule,
    NzTabsModule,
    NzSpinModule,
    NzDatePickerModule,
    NzSelectModule,
    NzDividerModule,
    NzPopoverModule,
    NzButtonModule,
    EmptyEchartsDirective,
    NzToolTipModule,
    HealthStatusDescPipe,
    InstanceStatusDescPipe
  ],
  providers: []
})
export class HomeModule {
}
