import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {MetricSetListComponent} from "./metric-set-list/metric-set-list.component";


const routes: Routes = [
  {
    path: 'metricSetManager',
    component: MetricSetListComponent,
    title: "诊断集管理"
  },
  {
    path: '**',
    loadComponent: () => import('./../../shared/components/empty-page/empty-page.component').then(module => module.EmptyPageComponent)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiagnosticMetricSetManagerRouting {
}
