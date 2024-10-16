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
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {InstanceDiagnosisComponent} from './instance-diagnosis/instance-diagnosis.component';
import {InstanceStatusDescPipe} from "../../shared/pipe/instance-status-desc.pipe";
import {LetDirective} from "@ngrx/component";
import {InstanceDiagnosisListComponent} from './instance-diagnosis-list/instance-diagnosis-list.component';
import {DiagnosticResourceTypePipe} from "../../shared/pipe/diagnostic-resource-type.pipe";
import {DiagnosticReportStatusPipe} from './pipe/diagnostic-report-status.pipe';
import {
  InstanceDiagnosisReportDetailComponent
} from './instance-diagnosis-report-detail/instance-diagnosis-report-detail.component';
import {
  InstanceDiagnosisTaskListComponent
} from './instance-diagnosis-task-list/instance-diagnosis-task-list.component';
import {
  InstanceDiagnosisTaskBatchConcurrencyControlType,
  InstanceDiagnosisTaskBatchControlType,
  InstanceDiagnosisTaskInvokeCategoryPipe,
  InstanceDiagnosisTaskInvokeModePipe,
  InstanceDiagnosisTaskInvokeStatusPipe,
  InstanceDiagnosisTaskModePipe,
} from './pipe/instance-diagnosis-task-mode.pipe';
import {LocalDatePipe} from "../../shared/pipe/local-date.pipe";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {
  InstanceDiagnosisTaskDetailComponent
} from './instance-diagnosis-task-detail/instance-diagnosis-task-detail.component';
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import { InstanceDiagnosisHeaderComponent } from './instance-diagnosis-header/instance-diagnosis-header.component';


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
        NzTimelineModule,
        NzToolTipModule,
        InstanceStatusDescPipe,
        LetDirective,
        DiagnosticResourceTypePipe,
        NzDropDownModule,
        NzMenuModule,
        NzRadioModule,
        LocalDatePipe,
        NzStepsModule,
        NzInputNumberModule,
        NzSpaceModule,
        NzDescriptionsModule,
        NzSwitchModule
    ],
  declarations: [
    InstanceDiagnosisComponent,
    InstanceDiagnosisListComponent,
    DiagnosticReportStatusPipe,
    InstanceDiagnosisReportDetailComponent,
    InstanceDiagnosisTaskListComponent,
    InstanceDiagnosisTaskModePipe,
    InstanceDiagnosisTaskInvokeModePipe,
    InstanceDiagnosisTaskInvokeStatusPipe,
    InstanceDiagnosisTaskInvokeCategoryPipe,
    InstanceDiagnosisTaskBatchConcurrencyControlType,
    InstanceDiagnosisTaskBatchControlType,
    InstanceDiagnosisTaskDetailComponent,
    InstanceDiagnosisHeaderComponent,
  ],
  providers: [],
  exports: []
})
export class CustomerDiagnosisModule {
}
