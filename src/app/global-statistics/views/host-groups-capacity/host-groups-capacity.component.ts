import {Component, OnInit} from '@angular/core';
import {SystemMetricType} from '../../../common/models/metrics/system-metric-type.enum';
import {SystemPool} from '../../../common/models/system-pool.vo';
import {SystemAggregatedStatistics} from '../../utils/weighted-arithmetic-mean.utils';
import {SasiColumnBuilder, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../../metric.service';
import {BusService} from '../../bus.service';
import {LocalStorageService} from 'ngx-store-9';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {RowGroupTableComponent} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {RouteLinkFormatterComponent} from '../../../common/components/route-link-formatter/route-link-formatter.component';
import {SasiWeightedArithmeticMeanUtils} from '../../utils/sasi-weighted-arithmetic-mean.utils';
import {GroupSortImpl} from '../../../common/components/sasi-table/group-sort-impl';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TierFormatterComponent} from '../../formatters/tier-formatter/tier-formatter.component';
import {MetricHandlerUtils} from '../../utils/metric-handler.utils';
import {StorageEntityMetricDto} from '../../../common/models/dtos/storage-entity-metric.dto';
import {SeTextFormatterComponent} from '../../../storage-configuration/se-text-formatter/se-text-formatter.component';

@Component({
  selector: 'app-host-groups-capacity',
  templateUrl: './host-groups-capacity.component.html',
  styleUrls: ['./host-groups-capacity.component.css'],
  animations: [
    trigger('slideInOut', [
      state('true', style({height: '0px', overflow: 'hidden', margin: '0'})),
      state('false', style({'height': '*', overflow: 'hidden', margin: '0'})),
      transition('1 => 0', animate('500ms ease-in')),
      transition('0 => 1', animate('500ms ease-out'))
    ]),
    trigger('iconRotate', [
      state('false', style({transform: 'rotate(0deg)'})),
      state('true', style({transform: 'rotate(90deg)'})),
      transition('1 => 0', animate('500ms')),
      transition(':enter', animate('0ms')),
      transition(':leave', animate('0ms')),
      transition('0 => 1', animate('500ms'))
    ])
  ]
})
export class HostGroupsCapacityComponent implements OnInit {


  types = [
    SystemMetricType.NET_TOTAL,
    SystemMetricType.NET_USED,
    SystemMetricType.NET_USED_PERC,
    SystemMetricType.CAPACITY_CHANGE_1D,
    SystemMetricType.CAPACITY_CHANGE_1W,
    SystemMetricType.CAPACITY_CHANGE_1M
  ];
  data: StorageEntityMetricDto[] = []; // Todo caching data by dataCenters

  aggregatedStats: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();

  options: SasiTableOptions = new SasiTableOptions();

  // TODO common with logical capacity
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
        .withLabel('Host-Group')
        .withAltLabel('System')
        .withComponent(RouteLinkFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.TIER)
        .withLabel('Tier')
        .withColumnTooltipText('Tier label - internal number of the Tier where VMware farm (HostGroup) is stored (reflects DP pool Tier)')
        .withComponent(TierFormatterComponent)
        .withTooltipText('Tier')
        .withColumnWidth('6')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_TOTAL)
        .withLabel('Provisioned Capacity')
        .withColumnTooltipText('Total provisioned capacity to servers (to Host Group)')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Provisioned Capacity')
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_USED)
        .withLabel('Used Capacity')
        .withColumnTooltipText('Used capacity of servers in TB')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Used Capacity')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.NET_USED_PERC)
        .withLabel('Used Capacity [%}')
        .withColumnTooltipText('Used capacity of servers in percentage')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('Used Capacity')
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.CAPACITY_CHANGE_1D)
        .withLabel('Last Day Change')
        .withColumnTooltipText('Calculated change in GB [Today]-[Yesterday] of USED capacity')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('One Day Change')
        .withInfinity(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.CAPACITY_CHANGE_1W)
        .withLabel('Last Week Change')
        .withColumnTooltipText('Calculated change in GB [Today]-[7 Days Back] of USED capacity')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('One Week Change')
        .withInfinity(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.CAPACITY_CHANGE_1M)
        .withLabel('Last Month Change')
        .withColumnTooltipText('Calculated change in GB [Today]-[30 Days Back] of USED capacity')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('One Month Change')
        .withInfinity(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('sortId')
        .withLabel('Sort ID')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withHidden(true)
        .build()
    );
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.labelColumnWidth = '13';
    this.options.valueColumnWidth = '12.9';
    this.options.storageNamePrefix = 'hostGroupCap';
    this.options.selectableRows = true;
    this.options.aggregateValuesService = new SasiWeightedArithmeticMeanUtils();
    this.options.sortService = new GroupSortImpl();
    this.options.sortColumnNames = ['sortId', 'name'];
    this.options.columnAlign = 'right';

  }

  // Todo common with logical stats
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bus.announceDatacenter(id);
        this.bus.announceContext('host-group-capacity');
        this.getTableData(id);
      }
    );
    this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
      data => {
        this.selectedRows = data.newValue;
      }
    );

  }

  getTableData(id: number): StorageEntityMetricDto[] {
    this.metricService.getHostGroupCapacityStatistics(id).subscribe(
      data => this.data = MetricHandlerUtils.success(data),
      error => this.data = MetricHandlerUtils.error(error)
    );
    return this.data;
  }
}
