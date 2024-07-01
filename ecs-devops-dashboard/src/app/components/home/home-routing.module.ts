import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayHomeComponent } from './display-home/display-home.component';

const routes: Routes = [
  {
    path: '',
    component: DisplayHomeComponent,
    title: '概览页面'
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
export class HomeRoutingModule { }
