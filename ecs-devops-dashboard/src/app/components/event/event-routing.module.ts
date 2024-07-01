import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerEventComponent } from "./customer-event/customer-event.component";

const routes: Routes = [
  {
    path: 'customerEvent',
    component: CustomerEventComponent,
    title: '客户侧事件页面',
  },
  {
    title: '空页面',
    path: '**',
    loadComponent: () => import('./../../shared/components/empty-page/empty-page.component').then(module => module.EmptyPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
