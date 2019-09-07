import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../../metric.service';
import {SystemPool} from '../../../common/models/SystemPool';
import {SystemAggregatedStatistics} from '../../utils/WeightedArithmeticMean';
import {PeriodService} from '../../../period.service';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BusService} from '../../bus.service';
import {SasiColumnBuilder, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {RouteLinkFormatterComponent} from '../../formatters/route-link-formatter/route-link-formatter.component';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {AlertFormatterComponent} from '../../formatters/alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {AlertRule, Threshold} from '../../AlertRule';
import {SasiWeightedArithmeticMean} from '../../utils/SasiWeightedArithmeticMean';
import {GroupSortImpl} from '../../../common/components/sasi-table/group-sort-impl';
import {EmphFormatterComponent} from '../../formatters/emph-formatter/emph-formatter.component';
import {LocalStorageService} from 'ngx-store';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';


export class ItemKey {
  systemName: string;
  poolName: string;
}

class MetricLabels {
  [key: string]: string;
}

class SelectedItem {
  systemId: number;
  poolName: number;
}

@Component({
  selector: 'app-capacity-statistics',
  templateUrl: './physical-capacity-statistics.component.html',
  styleUrls: ['./physical-capacity-statistics.component.css', '../../global-statistics.component.css'],
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
export class PhysicalCapacityStatisticsComponent implements OnInit {

  types = [
    SystemMetricType.PHYSICAL_SUBS_PERC,
    SystemMetricType.PHYSICAL_CAPACITY,
    SystemMetricType.AVAILABLE_CAPACITY,
    SystemMetricType.LOGICAL_USED_PERC,
    SystemMetricType.PHYSICAL_USED_PERC,
    SystemMetricType.COMPRESS_RATIO,
    SystemMetricType.PREDICTION_L1,
    SystemMetricType.PREDICTION_L2,
    SystemMetricType.PREDICTION_L3
  ];
  data: SystemPool[] = []; // Todo caching data by dataCenters

  aggregatedStats: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();

  options: SasiTableOptions = new SasiTableOptions();

  // TODO common with logical capacity
  selectedRows: Array<SelectedRow>;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService,
    protected bus: BusService,
    protected localStorageService: LocalStorageService,
  ) {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withLabel('Pool')
        .withAltLabel('System')
        .withComponent(EmphFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
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
        .withIndex(SystemMetricType.PHYSICAL_SUBS_PERC)
        .withLabel('Physical Subscription')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.AVAILABLE_CAPACITY)
        .withLabel('Available Capacity')
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
        .withIndex(SystemMetricType.PHYSICAL_USED_PERC)
        .withLabel('Physical Used')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.COMPRESS_RATIO)
        .withLabel('Compression Ratio')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.CAPACITY_CHANGE_1D)
        .withLabel('Change 1D')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('One Day Change')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.CAPACITY_CHANGE_1W)
        .withLabel('Change 1W')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('One Week Change')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.CAPACITY_CHANGE_1M)
        .withLabel('Change 1M')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText('One Month Change')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PREDICTION_L1)
        .withLabel('Reach 80%')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withTooltipText('Days to reach 80% of "Physical Used"')
        .withInfinity(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PREDICTION_L2)
        .withLabel('Reach 85%')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withTooltipText('Days to reach 85% of "Physical Used"')
        .withInfinity(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PREDICTION_L3)
        .withLabel('Reach 88%')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withTooltipText('Days to reach 88% of "Physical Used"')
        .withInfinity(true)
        .build()
    );
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.labelColumnWidth = '13';
    this.options.valueColumnWidth = '6.65';
    this.options.storageNamePrefix = 'physicalCap';
    this.options.selectableRows = true;
    this.options.aggregateValuesService = new SasiWeightedArithmeticMean();
    this.options.sortService = new GroupSortImpl();
    this.options.columnAlign = 'right';

    this.options.cellDecoratorRules.push(new AlertRule(SystemMetricType.PHYSICAL_USED_PERC, new Threshold('text-green', 80, 84.9)));
    this.options.cellDecoratorRules.push(new AlertRule(SystemMetricType.PHYSICAL_USED_PERC, new Threshold('text-alert-yellow', 85, 88)));
    this.options.cellDecoratorRules.push(new AlertRule(SystemMetricType.PHYSICAL_USED_PERC, new Threshold('text-red', 88, 10000)));
  }

  // Todo common with logical stats
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bus.announceDatacenter(id);
        this.bus.announceContext('physical-capacity');
        this.getTableData(id);
      }
    );
    this.periodService.announceEnablePeriod(false);
    this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
      data => {
        this.selectedRows = data.newValue;
      }
    );

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
