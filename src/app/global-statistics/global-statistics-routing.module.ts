import {NgModule} from '@angular/core';
import {ActivatedRoute, RouterModule, Routes} from '@angular/router';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {PerformanceStatisticsComponent} from './views/performance-statistics/performance-statistics.component';
import {DpSlaComponent} from './views/dp-sla/dp-sla.component';
import {AdaptersComponent} from './views/adapters/adapters.component';
import {LogicalCapacityStatisticsComponent} from './views/logical-capacity-statistics/logical-capacity-statistics.component';
import {PhysicalCapacityStatisticsComponent} from './views/physical-capacity-statistics/physical-capacity-statistics.component';
import {HostGroupsCapacityComponent} from './views/host-groups-capacity/host-groups-capacity.component';
import {BlockSizeLatencyComponent} from './views/block-size-latency/block-size-latency.component';


const routes: Routes = [
  {path: 'global-statistics/latency', component: BlockSizeLatencyComponent,},
  {
    path: 'global-statistics',
    component: GlobalStatisticsComponent, data: {
      breadcrumb: 'Global Statistics'
    },
    children: [
      {path: 'performance/:id', component: PerformanceStatisticsComponent, data: {
        breadcrumb: 'Global Statistics'
      }},
      {path: 'performance', redirectTo: 'performance/1', pathMatch: 'full'},
      {path: 'physical-capacity/:id', component: PhysicalCapacityStatisticsComponent, data: {
        breadcrumb: 'Physical Capacity'
      }},
      {path: 'physical-capacity', redirectTo: 'physical-capacity/1', pathMatch: 'full'},
      {path: 'logical-capacity/:id', component: LogicalCapacityStatisticsComponent, data: {
        breadcrumb: 'Logical Capacity'
      }},
      {path: 'logical-capacity', redirectTo: 'logical-capacity/1', pathMatch: 'full'},
      {path: 'dp-sla/:id', component: DpSlaComponent, data: {
        breadcrumb: 'SLA events'
      }},
      {path: 'dp-sla', redirectTo: 'dp-sla/1', pathMatch: 'full'},
      {path: 'adapters/:id', component: AdaptersComponent, data: {
        breadcrumb: 'Adapters'
      }},
      {path: 'adapters', redirectTo: 'adapters/1', pathMatch: 'full'},
      {path: 'host-group-capacity/:id', component: HostGroupsCapacityComponent, data: {
        breadcrumb: 'Host Group Capacity'
      }},
      {path: 'host-group-capacity', redirectTo: 'host-group-capacity/1', pathMatch: 'full', data: {
        breadcrumb: 'Host Group Capacity'
      }}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalStatisticsRoutingModule {
}
