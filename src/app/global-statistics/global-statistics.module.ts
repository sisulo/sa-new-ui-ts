import {NgModule} from '@angular/core';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';
import {PhysicalCapacityStatisticsComponent} from './physical-capacity-statistics/physical-capacity-statistics.component';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {CommonModule} from '@angular/common';
import {GlobalStatisticsRoutingModule} from './global-statistics-routing.module';
import {SaCommonModule} from '../common/sa-common.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {DpSlaComponent} from './dp-sla/dp-sla.component';
import {AdaptersComponent} from './adapters/adapters.component';
import {RouteLinkFormatterComponent} from './route-link-formatter/route-link-formatter.component';
import {UnitFormatterComponent} from './unit-formatter/unit-formatter.component';
import {AlertFormatterComponent} from './alert-formatter/alert-formatter.component';
import {SimpleFormatterComponent} from './simple-formatter/simple-formatter.component';
import {TimeFormatterComponent} from './time-formatter/time-formatter.component';
import {Seconds2FullTimePipe} from './utils/seconds-2-full-time.pipe';
import {TextFormatterComponent} from './text-formatter/text-formatter.component';
import {AggragatedStatisticsComponent} from './aggragated-statistics/aggragated-statistics.component';
import {EmphFormatterComponent} from './emph-formatter/emph-formatter.component';
import {DisbalanceFormatterComponent} from './disbalance-formatter/disbalance-formatter.component';
import {LogicalCapacityStatisticsComponent} from './logical-capacity-statistics/logical-capacity-statistics.component';
import {GlobalPhysicalCapacityStatisticsComponent} from './global-physical-capacity-statistics/global-physical-capacity-statistics.component';
import {GlobalLogicalStatisticsComponent} from './global-logical-statistics/global-logical-statistics.component';

@NgModule({
  declarations: [
    GlobalStatisticsComponent,
    PhysicalCapacityStatisticsComponent,
    PerformanceStatisticsComponent,
    DpSlaComponent,
    AdaptersComponent,
    RouteLinkFormatterComponent,
    UnitFormatterComponent,
    AlertFormatterComponent,
    SimpleFormatterComponent,
    TimeFormatterComponent,
    Seconds2FullTimePipe,
    TextFormatterComponent,
    AggragatedStatisticsComponent,
    EmphFormatterComponent,
    DisbalanceFormatterComponent,
    LogicalCapacityStatisticsComponent,
    GlobalPhysicalCapacityStatisticsComponent,
    GlobalLogicalStatisticsComponent
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
