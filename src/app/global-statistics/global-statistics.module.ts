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
import {UnitFormatterComponent} from './formatters/unit-formatter/unit-formatter.component';
import {AlertFormatterComponent} from './formatters/alert-formatter/alert-formatter.component';
import {SimpleFormatterComponent} from './formatters/simple-formatter/simple-formatter.component';
import {TimeFormatterComponent} from './formatters/time-formatter/time-formatter.component';
import {Seconds2FullTimePipe} from './utils/seconds-2-full-time.pipe';
import {TextFormatterComponent} from './formatters/text-formatter/text-formatter.component';
import {AggregatedStatisticsComponent} from './components/aggregated-statistics/aggregated-statistics.component';
import {EmphFormatterComponent} from './formatters/emph-formatter/emph-formatter.component';
import {PortDisbalanceFormatterComponent} from './formatters/port-disbalance-formatter/port-disbalance-formatter.component';
import {LogicalCapacityStatisticsComponent} from './views/logical-capacity-statistics/logical-capacity-statistics.component';
import {GlobalPhysicalCapacityStatisticsComponent} from './components/aggregated-statistics/global-physical-capacity-statistics.component';
import {GlobalLogicalStatisticsComponent} from './components/grouped-aggregated-statistics/global-logical-statistics.component';
import {GroupedAggregatedStatisticsComponent} from './components/grouped-aggregated-statistics/grouped-aggregated-statistics.component';
import {HostGroupsCapacityComponent} from './views/host-groups-capacity/host-groups-capacity.component';
import {GlobalHostGroupCapacityComponent} from './components/aggregated-statistics/global-host-group-capacity.component';
import {TierFormatterComponent} from './formatters/tier-formatter/tier-formatter.component';
import {AdapterDisbalanceFormatterComponent} from './formatters/adapter-disbalance-formatter/adapter-disbalance-formatter.component';
import {EmptyFormatterComponent} from './formatters/empty-formatter/empty-formatter.component';
import {BlockSizeLatencyComponent} from './views/block-size-latency/block-size-latency.component';
import {BubbleChartComponent} from './views/block-size-latency/bubble-chart/bubble-chart.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FilterListComponent} from './views/block-size-latency/filter-list/filter-list.component';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import { XaxisComponent } from './views/block-size-latency/bubble-chart/xaxis/xaxis.component';
import { YaxisComponent } from './views/block-size-latency/bubble-chart/yaxis/yaxis.component';

@NgModule({
  declarations: [
    GlobalStatisticsComponent,
    PhysicalCapacityStatisticsComponent,
    PerformanceStatisticsComponent,
    DpSlaComponent,
    AdaptersComponent,
    UnitFormatterComponent,
    AlertFormatterComponent,
    SimpleFormatterComponent,
    TimeFormatterComponent,
    Seconds2FullTimePipe,
    TextFormatterComponent,
    AggregatedStatisticsComponent,
    GroupedAggregatedStatisticsComponent,
    EmphFormatterComponent,
    PortDisbalanceFormatterComponent,
    LogicalCapacityStatisticsComponent,
    GlobalPhysicalCapacityStatisticsComponent,
    GlobalLogicalStatisticsComponent,
    HostGroupsCapacityComponent,
    GlobalHostGroupCapacityComponent,
    TierFormatterComponent,
    AdapterDisbalanceFormatterComponent,
    EmptyFormatterComponent,
    BlockSizeLatencyComponent,
    BubbleChartComponent,
    FilterListComponent,
    XaxisComponent,
    YaxisComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    GlobalStatisticsRoutingModule,
    SaCommonModule,
    TooltipModule,
    NgApexchartsModule,
    NgSelectModule,
    FormsModule
  ]
})
export class GlobalStatisticsModule {
}
