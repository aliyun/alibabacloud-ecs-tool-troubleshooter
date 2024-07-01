import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerDiagnosisRoutingModule} from "./customer-diagnosis-routing.module";
import {NzSegmentedModule} from "ng-zorro-antd/segmented";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {NzIconModule} from "ng-zorro-antd/icon";
import {PanelTitleComponent} from "../../shared/components/panel-title/panel-title.component";
import {CardDirective} from "../../shared/directive/card.directive";
import {CopyTextDirective} from "../../shared/directive/copy-text.directive";
import {NgxEchartsModule} from "ngx-echarts";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzInputModule} from "ng-zorro-antd/input";
import {CustomerDiagnosisComponent} from "./customer-diagnosis.component";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzListModule} from "ng-zorro-antd/list";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzTimelineModule} from "ng-zorro-antd/timeline";
import {DiagnosisReportComponent} from './diagnosis-report/diagnosis-report.component';
import {DiagnosisReportListComponent} from './diagnosis-report-list/diagnosis-report-list.component';


@NgModule({
  imports: [
    CommonModule,
    CustomerDiagnosisRoutingModule,
    NzSegmentedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature("diagnose", {}),
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
    NzSpinModule,
    NzAlertModule,
    NzModalModule,
    NzCheckboxModule,
    NzCollapseModule,
    NzEmptyModule,
    NzListModule,
    NzPopoverModule,
    NzSkeletonModule,
    NzProgressModule,
    NzGridModule,
    NzTimelineModule
  ],
  declarations: [
    CustomerDiagnosisComponent,
    DiagnosisReportComponent,
    DiagnosisReportListComponent,
  ],
  providers: [],
  exports: []
})
export class CustomerDiagnosisModule {
}
