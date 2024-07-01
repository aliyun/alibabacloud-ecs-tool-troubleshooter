import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerDiagnosisComponent } from "./customer-diagnosis.component";

const routes: Routes = [
  {
    path: '',
    component: CustomerDiagnosisComponent,
    title: "自诊断"
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
export class CustomerDiagnosisRoutingModule { }
