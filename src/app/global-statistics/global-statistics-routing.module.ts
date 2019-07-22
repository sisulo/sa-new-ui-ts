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
      {path: 'performance/:id', component: PerformanceStatisticsComponent},
      {path: 'performance', redirectTo: 'performance/1', pathMatch: 'full'},
      {path: 'capacity/:id', component: CapacityStatisticsComponent},
      {path: 'capacity', redirectTo: 'capacity/1', pathMatch: 'full'},
      {path: 'dp-sla/:id', component: DpSlaComponent},
      {path: 'dp-sla', redirectTo: 'dp-sla/1', pathMatch: 'full'},
      {path: 'adapters/:id', component: AdaptersComponent},
      {path: 'adapters', redirectTo: 'adapters/1', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalStatisticsRoutingModule { }
