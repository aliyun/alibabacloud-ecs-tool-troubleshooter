import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DiagnosticMetricSetManagerRouting} from "./diagnostic-metric-set-manager-routing";
import {MetricSetListComponent} from './metric-set-list/metric-set-list.component';
import {NzTableModule} from "ng-zorro-antd/table";
import {MetricSetEffectService} from "./service/metric-set-effect.service";
import {CardDirective} from "../../shared/directive/card.directive";
import {PanelTitleComponent} from "../../shared/components/panel-title/panel-title.component";
import {DiagnosticSetTypePipe} from "../../shared/pipe/diagnostic-set-type.pipe";
import {DiagnosticResourceTypePipe} from "../../shared/pipe/diagnostic-resource-type.pipe";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTagModule} from "ng-zorro-antd/tag";
import { ModifyMetricSetComponent } from './modify-metric-set/modify-metric-set.component';
import {NzTransferModule} from "ng-zorro-antd/transfer";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";


@NgModule({
  declarations: [
    MetricSetListComponent,
    ModifyMetricSetComponent
  ],
  imports: [
    CommonModule,
    DiagnosticMetricSetManagerRouting,
    NzTableModule,
    CardDirective,
    PanelTitleComponent,
    DiagnosticSetTypePipe,
    DiagnosticResourceTypePipe,
    NzIconModule,
    NzToolTipModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzSelectModule,
    NzButtonModule,
    NzTagModule,
    NzTransferModule,
    NzCheckboxModule
  ],
  providers: [
    MetricSetEffectService
  ]
})
export class DiagnosticMetricSetManagerModule {
}
