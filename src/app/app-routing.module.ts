import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {IframeComponent} from './iframe/iframe.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'iframe/:url', component: IframeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
