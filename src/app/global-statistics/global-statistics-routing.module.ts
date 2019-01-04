import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';
import {CapacityStatisticsComponent} from './capacity-statistics/capacity-statistics.component';
import {HeaderComponent} from '../components/header/header.component';

const routes: Routes = [
  {
    path: 'global-statistics',
    component: GlobalStatisticsComponent,
    children: [
      {path: ':id/performance', component: PerformanceStatisticsComponent},
      {path: 'performance', component: PerformanceStatisticsComponent},
      {path: ':id/capacity', component: CapacityStatisticsComponent},
      {path: 'capacity', component: CapacityStatisticsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlobalStatisticsRoutingModule { }
