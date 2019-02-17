import {NgModule} from '@angular/core';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';
import {CapacityStatisticsComponent} from './capacity-statistics/capacity-statistics.component';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {CommonModule} from '@angular/common';
import {GlobalStatisticsRoutingModule} from './global-statistics-routing.module';
import {SaCommonModule} from '../common/sa-common.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {DpSlaComponent} from './dp-sla/dp-sla.component';
import {AdaptersComponent} from './adapters/adapters.component';
import {SimpleUnitFormatterComponent} from './simple-unit-formatter/simple-unit-formatter.component';
import {UnitFormatterComponent} from './unit-formatter/unit-formatter.component';
import { AlertFormatterComponent } from './alert-formatter/alert-formatter.component';

@NgModule({
  declarations: [
    GlobalStatisticsComponent,
    CapacityStatisticsComponent,
    PerformanceStatisticsComponent,
    DpSlaComponent,
    AdaptersComponent,
    SimpleUnitFormatterComponent,
    UnitFormatterComponent,
    AlertFormatterComponent
  ],
  imports: [
    CommonModule,
    GlobalStatisticsRoutingModule,
    SaCommonModule,
    TooltipModule
  ]
})
export class GlobalStatisticsModule {
}
