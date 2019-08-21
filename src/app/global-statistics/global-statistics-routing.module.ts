import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {PerformanceStatisticsComponent} from './views/performance-statistics/performance-statistics.component';
import {DpSlaComponent} from './views/dp-sla/dp-sla.component';
import {AdaptersComponent} from './views/adapters/adapters.component';
import {LogicalCapacityStatisticsComponent} from './views/logical-capacity-statistics/logical-capacity-statistics.component';
import {PhysicalCapacityStatisticsComponent} from './views/physical-capacity-statistics/physical-capacity-statistics.component';

const routes: Routes = [
  {
    path: 'global-statistics',
    component: GlobalStatisticsComponent,
    children: [
      {path: 'performance/:id', component: PerformanceStatisticsComponent},
      {path: 'performance', redirectTo: 'performance/1', pathMatch: 'full'},
      {path: 'physical-capacity/:id', component: PhysicalCapacityStatisticsComponent},
      {path: 'physical-capacity', redirectTo: 'physical-capacity/1', pathMatch: 'full'},
      {path: 'logical-capacity/:id', component: LogicalCapacityStatisticsComponent},
      {path: 'logical-capacity', redirectTo: 'logical-capacity/1', pathMatch: 'full'},
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
