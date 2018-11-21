import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {SideMenuComponent} from './side-menu/side-menu.component';
import {FormsModule} from '@angular/forms';
import { IframeComponent } from './iframe/iframe.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KnobModule } from '@xmlking/ngx-knob';
import { KnobComponent } from './knob/knob.component';

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
