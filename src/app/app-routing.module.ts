import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IframeComponent} from './components/iframe/iframe.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [

  {path: 'dashboard', component: DashboardComponent, 
  data: {
      breadcrumb: 'Dashboard'
    },
},
  {path: 'iframe/:url', component: IframeComponent},
  {
    path: 'global-statistics',
    loadChildren: './global-statistics/global-statistics.module#GlobalStatisticsModule',
  },
  {path: '', component: DashboardComponent,data: {
    breadcrumb: 'Dashboard'
  }},
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { enableTracing: true }) // debugging
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
