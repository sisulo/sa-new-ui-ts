import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IframeComponent} from './components/iframe/iframe.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {PerformanceStatisticsComponent} from './components/performance-statistics/performance-statistics.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'iframe/:url', component: IframeComponent},
  {path: 'performance-statistics', component: PerformanceStatisticsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
