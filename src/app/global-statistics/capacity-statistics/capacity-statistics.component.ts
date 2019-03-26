import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../metric.service';
import {SystemPool} from '../../common/models/SystemPool';
import {AggregatedStatisticsService} from './aggregated-statistics.service';
import {SystemAggregatedStatistics} from '../utils/WeightedArithmeticMean';
import {PeriodService} from '../../period.service';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BusService} from '../bus.service';
import {SasiColumn, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {RouteLinkFormatterComponent} from '../route-link-formatter/route-link-formatter.component';
import {SimpleFormatterComponent} from '../simple-formatter/simple-formatter.component';
import {AlertFormatterComponent} from '../alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {AlertRule, Threshold} from '../AlertRule';
import {SasiWeightedArithmeticMean} from '../utils/SasiWeightedArithmeticMean';


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
  templateUrl: './capacity-statistics.component.html',
  styleUrls: ['./capacity-statistics.component.css', '../global-statistics.component.css'],
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
export class CapacityStatisticsComponent implements OnInit {

  types = [
    SystemMetricType.PHYSICAL_SUBS,
    SystemMetricType.PHYSICAL_CAPACITY,
    SystemMetricType.AVAILABLE_CAPACITY,
    SystemMetricType.LOGICAL_USAGE,
    SystemMetricType.PHYSICAL_USAGE,
    SystemMetricType.COMPRESS_RATIO,
    SystemMetricType.PREDICTION_L1,
    SystemMetricType.PREDICTION_L2,
    SystemMetricType.PREDICTION_L3
  ];
  data: SystemPool[] = []; // Todo caching data by dataCenters

  aggregatedStats: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();

  options: SasiTableOptions = new SasiTableOptions();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService,
    private aggregateService: AggregatedStatisticsService,
    protected bus: BusService
  ) {
    this.options.columns.push(new SasiColumn('name', 'System', RouteLinkFormatterComponent, false, false));
    this.options.columns.push(new SasiColumn(SystemMetricType.PHYSICAL_CAPACITY, 'Physical Capacity', SimpleFormatterComponent, false, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.PHYSICAL_SUBS, 'Physical Subs', SimpleFormatterComponent, false, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.AVAILABLE_CAPACITY, 'Available Capacity', SimpleFormatterComponent, false, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.LOGICAL_USAGE, 'Logical Used', SimpleFormatterComponent, false, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.PHYSICAL_USAGE, 'Physical Used', SimpleFormatterComponent, false, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.COMPRESS_RATIO, 'Compression Ratio', SimpleFormatterComponent, false, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.PREDICTION_L1, 'Reach 80%', SimpleFormatterComponent, false, false));
    this.options.columns.push(new SasiColumn(SystemMetricType.PREDICTION_L2, 'Reach 85%', SimpleFormatterComponent, false, false));
    this.options.columns.push(new SasiColumn(SystemMetricType.PREDICTION_L3, 'Reach 90%', SimpleFormatterComponent, false, false));
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.labelColumnWidth = '13';
    this.options.valueColumnWidth = '8.88';
    this.options.storageNamePrefix = 'capacity';
    this.options.aggregateValuesService = new SasiWeightedArithmeticMean();

    this.options.cellDecoratorRules.push(new AlertRule(SystemMetricType.PHYSICAL_USAGE, new Threshold('text-orange', 80, 90)));
    this.options.cellDecoratorRules.push(new AlertRule(SystemMetricType.PHYSICAL_USAGE, new Threshold('text-red', 90, 10000)));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bus.announceDatacenter(id);
        this.bus.announceContext('capacity');
        this.getTableData(id);
      }
    );
    this.aggregateService.aggregatedStatistics$.subscribe(
      stats => {
        this.aggregatedStats = stats;
      }
    );
    this.periodService.announceEnablePeriod(false);

  }

  // getSystemStatistics(systemName: string): SystemAggregatedStatistics {
  //   return this.aggregatedStats.find(stats => stats.system === systemName);
  // }

  getTableData(id: number): SystemPool[] {
    this.metricService.getCapacityStatistics(id).subscribe(
      data => {
        // this.data = this.recalculateSorting(data.systems, SortType.ASC, null);
        this.data = data.systems;
        // this.data.forEach(system => {
        //   system.pools.forEach(pool => {
        //     this.poolMetrics[pool.name] = pool.metrics;
        //   });
        // });
        // this.aggregateService.aggregateStatsBySystems(this.selectedPools[this.currentDataCenterId], this.poolMetrics);
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

  // isSelectedPool(poolName: string, systemName: string): boolean {
  //   return this.selectedPools[this.currentDataCenterId].findIndex(
  //     pool => pool.poolName === poolName && pool.systemName === systemName
  //   ) > -1;
  // }
  //
  // selectPool(poolName: string, systemName: string): void {
  //
  //   if (this.selectedPools[this.currentDataCenterId] === undefined) {
  //     this.selectedPools[this.currentDataCenterId] = [];
  //   }
  //
  //   const index = this.selectedPools[this.currentDataCenterId].findIndex(
  //     pool => pool.poolName === poolName && pool.systemName === systemName
  //
  //   );
  //
  //   if (index >= 0) {
  //     this.selectedPools[this.currentDataCenterId].splice(index, 1);
  //   } else {
  //     this.selectedPools[this.currentDataCenterId].push({poolName: poolName, systemName: systemName});
  //   }
  //   // @ts-ignore
  //   this.selectedPools.save();
  //   this.aggregateService.aggregateStatsBySystems(this.selectedPools[this.currentDataCenterId], this.poolMetrics);
  // }
  //
  // isSelectedAll(): boolean {
  //   return this.selectedPools[this.currentDataCenterId].length === this.data.reduce((previousValue, currentValue) => {
  //     return previousValue + currentValue.pools.length;
  //   }, 0);
  // }
  //
  // getSelectedCount(): number {
  //   return this.selectedPools[this.currentDataCenterId].length;
  // }
  //
  // selectAll() {
  //   if (this.isSelectedAll()) {
  //     this.selectedPools[this.currentDataCenterId] = [];
  //   } else {
  //     this.selectedPools[this.currentDataCenterId] = [];
  //     this.data.forEach(system => system.pools.forEach(
  //       pool => this.selectedPools[this.currentDataCenterId].push({poolName: pool.name, systemName: system.name})
  //     ));
  //   }
  //   // @ts-ignore
  //   this.selectedPools.save();
  //   this.aggregateService.aggregateStatsBySystems(this.selectedPools[this.currentDataCenterId], this.poolMetrics);
  // }
  //
  // isPartiallySelected() {
  //   return this.selectedPools[this.currentDataCenterId].length > 0;
  // }

  // getSystemPools(systemName): SystemPool {
  //   return this.data.find(system => system.name === systemName);
  // }
  //
  // getSystemAlertType(systemName: string): string {
  //   const alertDef = this.alertsDefinition
  //     .sort((alertA, alertB) => this.compare(alertB.threshold.alertType, alertA.threshold.alertType))
  //     .find(
  //       definition => {
  //         const systemPool = this.getSystemPools(systemName);
  //         if (systemPool !== undefined) {
  //           return systemPool.pools.find(pool => this.checkAlert(pool, definition)) !== undefined;
  //         }
  //         return false;
  //       }
  //     );
  //   if (alertDef !== undefined) {
  //     return alertDef.threshold.alertType;
  //   }
  //
  //   return 'alert-ok';
  // }
  // isAlertingSystem(systemName: string): boolean {
  //   if (this.data.length > 0) {
  //     return this.alertsDefinition
  //       .find(
  //         definition => {
  //           const systemPool = this.getSystemPools(systemName);
  //           if (systemPool !== undefined) {
  //             return systemPool.pools.find(pool => this.checkAlert(pool, definition)) !== undefined;
  //           }
  //           return false;
  //         }
  //       ) !== undefined;
  //   }
  //   return false;
  // }
  //
  // getPoolAlertType(systemPool: SystemDetail): string {
  //   const alertDef = this.alertsDefinition
  //     .find(definition => {
  //       return this.checkAlert(systemPool, definition);
  //     });
  //   if (alertDef !== undefined) {
  //     return alertDef.threshold.alertType;
  //   }
  //   return 'alert-ok';
  // }
  //
  // isAlertingPool(systemPool: SystemDetail) {
  //   return this.alertsDefinition
  //     .find(definition => {
  //       return this.checkAlert(systemPool, definition);
  //     }) !== undefined;
  // }
  //
  // checkAlert(systemPool: SystemDetail, definition): boolean {
  //   if (systemPool !== null) {
  //     const metric = this.getMetric(systemPool.metrics, definition.type);
  //     if (metric != null) {
  //       return metric.value > definition.threshold.min && metric.value < definition.threshold.max;
  //     }
  //   }
  //   return false;
  // }
  //
  // getAlertType(systemPool: SystemDetail, type: SystemMetricType) {
  //   const alertDefinition = this.alertsDefinition
  //     .sort((alertA, alertB) => this.compare(alertB.threshold.alertType, alertA.threshold.alertType))
  //     .find(definition => {
  //       return this.checkAlert(systemPool, definition) && definition.type === type;
  //     });
  //   if (alertDefinition === undefined) {
  //     return 'alert-ok';
  //   } else {
  //     return alertDefinition.threshold.alertType;
  //   }
  // }
  //
  // getOccuredAlert(systemPool: SystemDetail, type: SystemMetricType) {
  //   return this.alertsDefinition
  //     .find(definition => {
  //       return this.checkAlert(systemPool, definition) && definition.type === type;
  //     });
  // }
  //
  //
  // getData() {
  //   return this.data;
  // }
  //
  // setData(data: SystemPool[]) {
  //   this.data = data;
  // }
  //
  // recalculateSorting(data: SystemPool[], sortType, sortColumn): SystemPool[] {
  //   let dataReturned = [];
  //   if (sortColumn === null) {
  //     dataReturned = data.map(system => {
  //       if (sortType === SortType.ASC) {
  //         system.pools = system.pools.sort((poolA, poolB) => this.compare(poolA.name, poolB.name));
  //       } else {
  //         system.pools = system.pools.sort((poolA, poolB) => this.compare(poolB.name, poolA.name));
  //       }
  //       return system;
  //     });
  //     dataReturned = dataReturned.sort(
  //       (systemA, systemB) => {
  //         if (sortType === SortType.ASC) {
  //           return this.compare(systemA.name, systemB.name);
  //         } else {
  //           return this.compare(systemB.name, systemA.name);
  //         }
  //       }
  //     );
  //   } else {
  //     dataReturned = data.map(system => {
  //       system.pools = system.pools.sort(
  //         (poolA, poolB) => {
  //           if (sortType === SortType.ASC) {
  //             return this.compare(this.findMetric(poolA, sortColumn).value, this.findMetric(poolB, sortColumn).value);
  //           } else {
  //             return this.compare(this.findMetric(poolB, sortColumn).value, this.findMetric(poolA, sortColumn).value);
  //           }
  //         }
  //       );
  //       return system;
  //     });
  //   }
  //   return dataReturned;
  // }
  //
  // findMetric(pool: SystemDetail, metricType: SystemMetricType) {
  //   return pool.metrics.find(metric => metric.type === metricType);
  // }
  //
  // compare(valueA, valueB) {
  //   if (valueA > valueB) {
  //     return 1;
  //   } else if (valueA < valueB) {
  //     return -1;
  //   }
  //   return 0;
  // }
}
