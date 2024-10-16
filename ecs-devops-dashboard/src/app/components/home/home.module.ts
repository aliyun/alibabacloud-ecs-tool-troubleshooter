import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

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
import {InstanceMaintenanceAttrComponent} from './instance-maintenance-attr/instance-maintenance-attr.component';
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzTagModule} from "ng-zorro-antd/tag";
import {InstanceMaintenanceAttrPipe} from "../../shared/pipe/instance-maintenance-attr.pipe";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {InstanceScreenSnapshotComponent} from './instance-screen-snapshot/instance-screen-snapshot.component';
import {InstanceConsoleOutputComponent} from './instance-console-output/instance-console-output.component';
import {ResourceDistributionComponent} from './resource-distribution/resource-distribution.component';
import {MapItemPositionDirective} from "../../shared/directive/map-item-position.directive";
import {LetDirective} from "@ngrx/component";
import {InstanceMonitorComponent} from './instance-monitor/instance-monitor.component';
import {NzModalModule} from "ng-zorro-antd/modal";

@NgModule({
  declarations: [
    DisplayHomeComponent,
    InstanceMaintenanceAttrComponent,
    InstanceScreenSnapshotComponent,
    InstanceConsoleOutputComponent,
    ResourceDistributionComponent,
    InstanceMonitorComponent,
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
    MapItemPositionDirective,
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
    InstanceStatusDescPipe,
    InstanceMaintenanceAttrPipe,
    NzDescriptionsModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzTagModule,
    NzDropDownModule,
    NgOptimizedImage,
    LetDirective,
    NzModalModule
  ],
  providers: []
})
export class HomeModule {
}
