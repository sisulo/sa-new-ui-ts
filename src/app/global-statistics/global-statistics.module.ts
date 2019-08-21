import {NgModule} from '@angular/core';
import {PerformanceStatisticsComponent} from './views/performance-statistics/performance-statistics.component';
import {PhysicalCapacityStatisticsComponent} from './views/physical-capacity-statistics/physical-capacity-statistics.component';
import {GlobalStatisticsComponent} from './global-statistics.component';
import {CommonModule} from '@angular/common';
import {GlobalStatisticsRoutingModule} from './global-statistics-routing.module';
import {SaCommonModule} from '../common/sa-common.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {DpSlaComponent} from './views/dp-sla/dp-sla.component';
import {AdaptersComponent} from './views/adapters/adapters.component';
import {RouteLinkFormatterComponent} from './formatters/route-link-formatter/route-link-formatter.component';
import {UnitFormatterComponent} from './formatters/unit-formatter/unit-formatter.component';
import {AlertFormatterComponent} from './formatters/alert-formatter/alert-formatter.component';
import {SimpleFormatterComponent} from './formatters/simple-formatter/simple-formatter.component';
import {TimeFormatterComponent} from './formatters/time-formatter/time-formatter.component';
import {Seconds2FullTimePipe} from './utils/seconds-2-full-time.pipe';
import {TextFormatterComponent} from './formatters/text-formatter/text-formatter.component';
import {AggragatedStatisticsComponent} from './components/aggragated-statistics/aggragated-statistics.component';
import {EmphFormatterComponent} from './formatters/emph-formatter/emph-formatter.component';
import {DisbalanceFormatterComponent} from './formatters/disbalance-formatter/disbalance-formatter.component';
import {LogicalCapacityStatisticsComponent} from './views/logical-capacity-statistics/logical-capacity-statistics.component';
import {GlobalPhysicalCapacityStatisticsComponent} from './components/global-physical-capacity-statistics/global-physical-capacity-statistics.component';
import {GlobalLogicalStatisticsComponent} from './components/global-logical-statistics/global-logical-statistics.component';

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
