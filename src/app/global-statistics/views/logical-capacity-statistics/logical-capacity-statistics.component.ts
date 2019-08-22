import {Component, OnInit} from '@angular/core';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {SystemPool} from '../../../common/models/SystemPool';
import {SystemAggregatedStatistics} from '../../utils/WeightedArithmeticMean';
import {SasiColumnBuilder, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../../period.service';
import {MetricService} from '../../../metric.service';
import {AggregatedStatisticsService} from '../physical-capacity-statistics/aggregated-statistics.service';
import {BusService} from '../../bus.service';
import {EmphFormatterComponent} from '../../formatters/emph-formatter/emph-formatter.component';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {RowGroupTableComponent} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {RouteLinkFormatterComponent} from '../../formatters/route-link-formatter/route-link-formatter.component';
import {SasiWeightedArithmeticMean} from '../../utils/SasiWeightedArithmeticMean';
import {GroupSortImpl} from '../../../common/components/sasi-table/group-sort-impl';
import {LocalStorageService} from 'ngx-store';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';

@Component({
  selector: 'app-physical-statistics',
  templateUrl: './logical-capacity-statistics.component.html',
  styleUrls: ['./logical-capacity-statistics.component.css']
})
export class LogicalCapacityStatisticsComponent implements OnInit {
  types = [
    SystemMetricType.SUBSCRIBED_CAPACITY,
    SystemMetricType.PHYSICAL_SUBS_PERC,
    SystemMetricType.LOGICAL_SUBS_PERC,
    SystemMetricType.NET_SUBS_PERC,
    SystemMetricType.PHYSICAL_CAPACITY,
    SystemMetricType.PHYSICAL_USED,
    SystemMetricType.PHYSICAL_FREE,
    SystemMetricType.PHYSICAL_USED_PERC,
    SystemMetricType.LOGICAL_CAPACITY,
    SystemMetricType.LOGICAL_USED,
    SystemMetricType.LOGICAL_FREE,
    SystemMetricType.LOGICAL_USED_PERC,
    SystemMetricType.NET_TOTAL,
    SystemMetricType.NET_USED,
    SystemMetricType.NET_FREE,
    SystemMetricType.NET_USED_PERC,
    SystemMetricType.COMPRESS_RATIO,
    SystemMetricType.DEDUP_RATIO,
    SystemMetricType.TOTAL_SAVING_EFFECT,

  ];
  data: SystemPool[] = [];

  aggregatedStats: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();

  options: SasiTableOptions = new SasiTableOptions();
  selectedRows: Array<SelectedRow>;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService,
    private aggregateService: AggregatedStatisticsService,
    protected bus: BusService,
    protected localStorageService: LocalStorageService,
  ) {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withLabel('System')
        .withComponent(EmphFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.SUBSCRIBED_CAPACITY)
        .withLabel('Subs. Capacity')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_SUBS_PERC)
        .withLabel('Physical Subs.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_SUBS_PERC)
        .withLabel('Logical Subs.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_USED_PERC)
        .withLabel('Logical Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_SUBS_PERC)
        .withLabel('NET Subs.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_CAPACITY)
        .withLabel('Physical Capacity')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_USED)
        .withLabel('Physical Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_FREE)
        .withLabel('Physical Free')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_USED_PERC)
        .withLabel('Physical Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_CAPACITY)
        .withLabel('Logical Capacity')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_USED)
        .withLabel('Logical Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_FREE)
        .withLabel('Logical Free')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_USED_PERC)
        .withLabel('Logical Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_TOTAL)
        .withLabel('Net Total')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_USED)
        .withLabel('Net Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_FREE)
        .withLabel('Net Free')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_USED_PERC)
        .withLabel('Net Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.COMPRESS_RATIO)
        .withLabel('Comp Ratio')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.DEDUP_RATIO)
        .withLabel('Dedup Ratio')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.TOTAL_SAVING_EFFECT)
        .withLabel('Total Saving Effect')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.labelColumnWidth = '13';
    this.options.valueColumnWidth = '4.17';
    this.options.storageNamePrefix = 'logicalCap';
    this.options.selectableRows = true;
    this.options.aggregateValuesService = new SasiWeightedArithmeticMean();
    this.options.sortService = new GroupSortImpl();
    this.options.columnAlign = 'right';

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bus.announceDatacenter(id);
        this.bus.announceContext('logical-capacity');
        this.getTableData(id);
      }
    );
    this.aggregateService.aggregatedStatistics$.subscribe(
      stats => {
        this.aggregatedStats = stats;
      }
    );
    this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
      data => {
        this.selectedRows = data.newValue;
      }
    );
    this.periodService.announceEnablePeriod(false);

  }

  getTableData(id: number): SystemPool[] {
    this.metricService.getCapacityStatistics(id).subscribe(
      data => {
        this.data = data.systems;
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

}
