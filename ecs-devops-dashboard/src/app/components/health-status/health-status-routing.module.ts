import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthStatusComponent } from "./health-status/health-status.component";

const routes: Routes = [
  {
    path: '',
    component: HealthStatusComponent
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
export class HealthStatusRoutingModule { }
