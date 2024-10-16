import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InstanceDiagnosisListComponent} from "./instance-diagnosis-list/instance-diagnosis-list.component";
import {
  InstanceDiagnosisReportDetailComponent
} from "./instance-diagnosis-report-detail/instance-diagnosis-report-detail.component";
import {
  InstanceDiagnosisTaskListComponent
} from "./instance-diagnosis-task-list/instance-diagnosis-task-list.component";
import {
  InstanceDiagnosisTaskDetailComponent
} from "./instance-diagnosis-task-detail/instance-diagnosis-task-detail.component";
import {InstanceDiagnosisComponent} from "./instance-diagnosis/instance-diagnosis.component";

const routes: Routes = [
  {
    path: '',
    component: InstanceDiagnosisComponent,
    title: "自诊断"
  },
  {
    path: 'list',
    component: InstanceDiagnosisListComponent,
    title: "历史诊断结果"
  },
  {
    path: 'detail',
    component: InstanceDiagnosisReportDetailComponent,
    title: "诊断报告"
  },
  {
    path: 'task-list',
    component: InstanceDiagnosisTaskListComponent,
    title: "实例诊断任务列表"
  },
  {
    path: 'task-detail',
    component: InstanceDiagnosisTaskDetailComponent,
    title: "实例诊断任务详情"
  },
  {
    path: 'task-update',
    component: InstanceDiagnosisComponent,
    title: "更新实例诊断定时任务"
  },
  {
    path: '**',
    loadComponent: () => import('./../../shared/components/empty-page/empty-page.component').then(module => module.EmptyPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDiagnosisRoutingModule {
}
