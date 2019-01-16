import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';
import {CapacityStatisticsComponent} from './capacity-statistics/capacity-statistics.component';
import {DpSlaComponent} from './dp-sla/dp-sla.component';
import {AdaptersComponent} from './adapters/adapters.component';

const routes: Routes = [
  {
    path: 'global-statistics',
    component: GlobalStatisticsComponent,
    children: [
      {path: ':id/performance', component: PerformanceStatisticsComponent},
      {path: 'performance', component: PerformanceStatisticsComponent},
      {path: ':id/capacity', component: CapacityStatisticsComponent},
      {path: 'capacity', component: CapacityStatisticsComponent},
      {path: ':id/dp-sla', component: DpSlaComponent},
      {path: 'dp-sla', component: DpSlaComponent},
      {path: ':id/adapters', component: AdaptersComponent},
      {path: 'adapters', component: AdaptersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalStatisticsRoutingModule { }
