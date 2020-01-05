import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {IframeComponent} from './components/iframe/iframe.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {GlobalStatisticsModule} from './global-statistics/global-statistics.module';
import {SaCommonModule} from './common/sa-common.module';
import {SystemPool2SasiGroupTablePipe} from './common/utils/system-pool-2-sasi-group-table.pipe';
import {NgApexchartsModule} from 'ng-apexcharts';
import {RegionDonutComponent} from './components/dashboard/charts/region-donut/region-donut.component';
import {FormsModule} from '@angular/forms';
import {WebStorageModule} from 'ngx-store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HistoryChartComponent} from './components/dashboard/charts/history-chart/history-chart.component';
import {CapacityHistoryChartComponent} from './components/dashboard/charts/capacity-history-chart/capacity-history-chart.component';
import {BarChartComponent} from './components/dashboard/charts/bar-chart/bar-chart.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {HttpLoading} from './http-loading.interceptor';

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: HttpLoading, multi: true},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    IframeComponent,
    DashboardComponent,
    RegionDonutComponent,
    HistoryChartComponent,
    CapacityHistoryChartComponent,
    BarChartComponent,
  ],
  imports: [
    GlobalStatisticsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    WebStorageModule,
    BrowserAnimationsModule,
    SaCommonModule,
    NgApexchartsModule,
    NgxSpinnerModule,

  ],
  providers: [SystemPool2SasiGroupTablePipe, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
