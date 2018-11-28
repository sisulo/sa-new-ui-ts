import {NgModule} from '@angular/core';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';
import {CapacityStatisticsComponent} from './capacity-statistics/capacity-statistics.component';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {CommonModule} from '@angular/common';
import {GlobalStatisticsRoutingModule} from './global-statistics-routing.module';
import {DataTableModule} from 'angular-6-datatable';
import {UnitFormatterComponent} from './unit-formatter/unit-formatter.component';

@NgModule({
  declarations: [
    GlobalStatisticsComponent,
    CapacityStatisticsComponent,
    PerformanceStatisticsComponent,
    UnitFormatterComponent
  ],
  imports: [
    CommonModule,
    GlobalStatisticsRoutingModule,
    DataTableModule
  ]
})
export class GlobalStatisticsModule {
}