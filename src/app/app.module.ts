import {BrowserModule} from '@angular/platform-browser';
import {Component, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {FormsModule} from '@angular/forms';
import {IframeComponent} from './components/iframe/iframe.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {GlobalStatisticsModule} from './global-statistics/global-statistics.module';
import {SaCommonModule} from './common/sa-common.module';
import {WebStorageModule} from 'ngx-store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    IframeComponent,
    DashboardComponent
  ],
  imports: [
    GlobalStatisticsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SaCommonModule,
    WebStorageModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
