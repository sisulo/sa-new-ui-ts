import {NgModule} from '@angular/core';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';
import {CapacityStatisticsComponent} from './capacity-statistics/capacity-statistics.component';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {CommonModule} from '@angular/common';
import {GlobalStatisticsRoutingModule} from './global-statistics-routing.module';
import {UnitFormatterComponent} from './unit-formatter/unit-formatter.component';
import {SaCommonModule} from '../common/sa-common.module';
import {DataTableModule} from 'angular-6-datatable';
import {AggregatedStatisticsComponent} from './aggregated-statistics/aggregated-statistics.component';

@NgModule({
  declarations: [
    GlobalStatisticsComponent,
    CapacityStatisticsComponent,
    PerformanceStatisticsComponent,
    UnitFormatterComponent,
    AggregatedStatisticsComponent
  ],
  imports: [
    CommonModule,
    GlobalStatisticsRoutingModule,
    SaCommonModule,
    DataTableModule
  ]
})
export class GlobalStatisticsModule {
}
