import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {SideMenuComponent} from './components/side-menu/side-menu.component';
import {FormsModule} from '@angular/forms';
import {IframeComponent} from './components/iframe/iframe.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {KnobModule} from '@xmlking/ngx-knob';
import {KnobComponent} from './components/knob/knob.component';
import {GlobalStatisticsModule} from './components/global-statistics/global-statistics.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    IframeComponent,
    DashboardComponent,
    KnobComponent,
  ],
  imports: [
    GlobalStatisticsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    KnobModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
