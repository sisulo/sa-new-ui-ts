import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {FormsModule} from '@angular/forms';
import { IframeComponent } from './components/iframe/iframe.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { KnobModule } from '@xmlking/ngx-knob';
import { KnobComponent } from './components/knob/knob.component';
import { PerformanceStatisticsComponent } from './components/performance-statistics/performance-statistics.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    IframeComponent,
    DashboardComponent,
    KnobComponent,
    PerformanceStatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    KnobModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
