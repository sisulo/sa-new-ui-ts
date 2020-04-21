import {Component, OnInit} from '@angular/core';
import {SystemMetricType} from '../../../common/models/metrics/system-metric-type.enum';
import {SystemPool} from '../../../common/models/system-pool.vo';
import {SystemAggregatedStatistics} from '../../utils/weighted-arithmetic-mean.utils';
import {SasiColumnBuilder, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../../metric.service';
import {BusService} from '../../bus.service';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {RowGroupTableComponent} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {RouteLinkFormatterComponent} from '../../../common/components/route-link-formatter/route-link-formatter.component';
import {SasiWeightedArithmeticMeanUtils} from '../../utils/sasi-weighted-arithmetic-mean.utils';
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
    protected metricService: MetricService,
    protected bus: BusService,
    protected localStorageService: LocalStorageService,
  ) {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withLabel('Pool')
        .withAltLabel('System')
        .withShortLabel('System')
        .withComponent(RouteLinkFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withAltBorder(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.SUBSCRIBED_CAPACITY)
        .withLabel('Total')
        .withColumnTooltipText('Total Subscribed capacity (TB) of the DP Pool.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Subscribed Capacity')
        .withAltBorder(false)
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_SUBS_PERC)
        .withLabel('Physical Subs.')
        .withColumnTooltipText('Physical Subscribed capacity (%) of the DP Pool.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Physical Subscription')
        .withShortLabel('Physical')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_SUBS_PERC)
        .withLabel('Logical Subs.')
        .withColumnTooltipText('Logical Subscribed capacity (%) of the DP Pool.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Logical Subscription')
        .withShortLabel('Logical')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_SUBS_PERC)
        .withLabel('Net Subs.')
        .withColumnTooltipText('NET Subscribed capacity (%) of the DP Pool.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Net Subscription')
        .withShortLabel('Net')
        .withAltBorder(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_CAPACITY)
        .withLabel('Total')
        .withColumnTooltipText('Total physical capacity (TB) of the DP Pool. Physical capacity = capacity of the real HW components (HDDs/FMDs/Spindles).')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Physical Capacity (Physical data occupation on HDD/FMD/SSD)')
        .withShortLabel('Total')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_USED)
        .withLabel('Physical Used')
        .withColumnTooltipText('Physically used capacity (TB) of the DP Pool. Meaning what is the physical occupation of data on HW components (HDDs/FMDs/Spindles) (so after compression and deduplication)')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Physical Used')
        .withShortLabel('Used')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_FREE)
        .withLabel('Physical Free')
        .withColumnTooltipText('Physically free capacity (TB) of the DP Pool. Meaning what is the physical free space on HW components (HDDs/FMDs/Spindles)')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Physical Free')
        .withShortLabel('Free')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PHYSICAL_USED_PERC)
        .withLabel('Physical Used')
        .withColumnTooltipText('Capacity which is physically stored on DP Pool HDD\'s in %')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Physical Used')
        .withAltBorder(true)
        .withShortLabel('Used')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_CAPACITY)
        .withLabel('Total')
        .withColumnTooltipText('Logical capacity (TB) of the DP Pool. Logical capacity is "virtual" capacity for non-spindle disk pools. It is calculated as [physical capacity] x [constant]. In common cases [constant] is set to 2 (because of default compression on FMDs)')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Logical Capacity')
        .withShortLabel('Total')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_USED)
        .withLabel('Logical Used')
        .withColumnTooltipText('\tLogical Used capacity (TB) of the DP Pool. Logical capacity is "virtual" capacity for non-spindle disk pools. It is calculated as [physical capacity] x [constant]. In common cases [constant] is set to 2')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Logical Used')
        .withShortLabel('Used')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_FREE)
        .withLabel('Logical Free')
        .withColumnTooltipText('Logical Free capacity (TB) of the DP Pool. Logical capacity is "virtual" capacity for non-spindle disk pools. It is calculated as [physical capacity] x [constant]. In common cases [constant] is set to 2')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Logical Free')
        .withShortLabel('Free')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.LOGICAL_USED_PERC)
        .withLabel('Logical Used')
        .withColumnTooltipText('Logical Used capacity (%) of the DP Pool. Logical capacity is "virtual" capacity for non-spindle disk pools.')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Logical Used')
        .withAltBorder(true)
        .withShortLabel('Used')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_TOTAL)
        .withLabel('Net Capacity')
        .withColumnTooltipText('NET capacity = Capacity without any saving mechanism (Dedup/Compression). Calculated as [Physical Capacity] x [Total Saving Effect]')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Net Capacity (Virtual capacity without any saving mechanism)')
        .withShortLabel('Total')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_USED)
        .withLabel('Net Used')
        .withColumnTooltipText('NET capacity = Capacity without any saving mechanism (Dedup/Compression). Calculated as [Physical Used] x [Total Saving Effect]')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Net Used')
        .withShortLabel('Used')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_FREE)
        .withLabel('Net Free')
        .withColumnTooltipText('NET capacity = Capacity without any saving mechanism (Dedup/Compression). Calculated as [Physical Free] x [Total Saving Effect]')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Net Free')
        .withShortLabel('Free')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_USED_PERC)
        .withLabel('Net Used')
        .withColumnTooltipText('NET capacity = Capacity without any saving mechanism (Dedup/Compression).')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Net Used')
        .withShortLabel('Used')
        .withAltBorder(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.COMPRESS_RATIO)
        .withLabel('Comp Ratio')
        .withColumnTooltipText('Compression Ratio of the FMD\'s in the DP Pool. Summary calculation is performed on pools with compression ration >0')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Compression Ratio')
        .withShortLabel('Comp')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.DEDUP_RATIO)
        .withLabel('Dedup Ratio')
        .withColumnTooltipText('Deduplication Ratio of the DP Pool. Summmary calculation is performed on pools with dedup ration >0)')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Deduplication Ratio')
        .withShortLabel('Dedup')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.TOTAL_SAVING_EFFECT)
        .withLabel('Saving effect')
        .withColumnTooltipText('Total saving effect of Deduplication (SW feature) + Compression (FMD\'s). Summmary calculation is performed on pools with total saving effect >1)')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Total Saving Effect')
        .withShortLabel('Total')
        .build()
    );
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.labelColumnWidth = '10.5';
    this.options.valueColumnWidth = '4.52';
    this.options.storageNamePrefix = 'logicalCap';
    this.options.selectableRows = true;
    this.options.aggregateValuesService = new SasiWeightedArithmeticMeanUtils();
    this.options.sortService = new GroupSortImpl();
    this.options.columnAlign = 'right';
    this.options.headerGroups = [
      {
        name: '',
        columns: ['controls']
      },
      {
        name: '',
        columns: ['name']
      },
      {
        name: 'Subscription',
        columns: [
          SystemMetricType.SUBSCRIBED_CAPACITY,
          SystemMetricType.PHYSICAL_SUBS_PERC,
          SystemMetricType.LOGICAL_SUBS_PERC,
          SystemMetricType.NET_SUBS_PERC
        ]
      },
      {
        name: 'Physical',
        columns: [
          SystemMetricType.PHYSICAL_CAPACITY,
          SystemMetricType.PHYSICAL_USED,
          SystemMetricType.PHYSICAL_FREE,
          SystemMetricType.PHYSICAL_USED
        ]
      },
      {
        name: 'Logical',
        columns: [
          SystemMetricType.LOGICAL_CAPACITY,
          SystemMetricType.LOGICAL_USED,
          SystemMetricType.LOGICAL_FREE,
          SystemMetricType.LOGICAL_USED
        ]
      },
      {
        name: 'Net',
        columns: [
          SystemMetricType.NET_TOTAL,
          SystemMetricType.NET_USED,
          SystemMetricType.NET_FREE,
          SystemMetricType.NET_SUBS_PERC
        ]
      },
      {
        name: 'Savings',
        columns: [
          SystemMetricType.COMPRESS_RATIO,
          SystemMetricType.DEDUP_RATIO,
          SystemMetricType.TOTAL_SAVING_EFFECT
        ]
      },
    ];

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
    this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
      data => {
        this.selectedRows = data.newValue;
      }
    );
  }

  getTableData(id: number): SystemPool[] {
    this.metricService.getCapacityStatistics(id).subscribe(
      data => {
        this.data = [];
        data.datacenters.forEach(datacenter => this.data = [...this.data, ...datacenter.systems]);
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

}
