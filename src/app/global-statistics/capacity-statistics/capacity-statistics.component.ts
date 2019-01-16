import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../metric.service';
import {BusService} from '../bus.service';
import {SystemPool} from '../../common/models/SystemPool';
import {LocalStorage} from 'ngx-store';
import {AggregatedStatisticsService} from './aggregated-statistics.service';
import {SystemAggregatedStatistics} from '../utils/WeightedArithmeticMean';
import {PeriodService} from '../../period.service';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SystemDetail} from '../../common/models/SystemDetail';
import {DivTable, SortType} from '../div-table/div-table';
import {animate, state, style, transition, trigger} from '@angular/animations';


export class ItemKey {
  systemName: string;
  poolName: string;
}

class SelectedItems {
  [key: string]: Array<ItemKey>;
}

class CollapsedItems {
  [key: string]: Array<string>;
}

class MetricLabels {
  [key: string]: string;
}

@Component({
  selector: 'app-capacity-statistics',
  templateUrl: './capacity-statistics.component.html',
  styleUrls: ['./capacity-statistics.component.css', '../global-statistics.component.css'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ height: '0px', display: 'none', opacity: 0})),
      state('false', style({ height: '*', opacity: 1})),
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
export class CapacityStatisticsComponent extends DivTable implements OnInit {

  types = [
    SystemMetricType.PHYSICAL_SUBS,
    SystemMetricType.PHYSICAL_CAPACITY,
    SystemMetricType.AVAILABLE_CAPACITY,
    SystemMetricType.LOGICAL_USAGE,
    SystemMetricType.PHYSICAL_USAGE,
    SystemMetricType.COMPRESS_RATIO
  ];
  data: SystemPool[] = []; // Todo caching data by dataCenters
  currentDataCenterId = 0;
  poolMetrics = {};
  aggregatedStats: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();
  alertsDefinition = [
    {type: SystemMetricType.PHYSICAL_SUBS, threshold: {alertType: 'text-orange', min: 80, max: 85}},
    {type: SystemMetricType.PHYSICAL_SUBS, threshold: {alertType: 'text-red', min: 85, max: 10000}}
  ];
  @LocalStorage() selectedPools: SelectedItems = {};
  @LocalStorage() collapsedRows: CollapsedItems = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private bus: BusService,
    private aggregateService: AggregatedStatisticsService,
    private periodService: PeriodService
  ) {
    super();
    // this.types.push(SystemMetricType.PHYSICAL_SUBS);
    // this.types.push(SystemMetricType.PHYSICAL_CAPACITY);
    // this.types.push(SystemMetricType.AVAILABLE_CAPACITY);
    // this.types.push(SystemMetricType.LOGICAL_USAGE);
    // this.types.push(SystemMetricType.PHYSICAL_USAGE);
    // this.types.push(SystemMetricType.COMPRESS_RATIO);

    // this.alertsDefinition.push({type: SystemMetricType.PHYSICAL_SUBS, threshold: {alertType: 'text-orange', min: 80, max: 85}});
    // this.alertsDefinition.push({type: SystemMetricType.PHYSICAL_SUBS, threshold: {alertType: 'text-red', min: 85, max: 10000}});

    this.labelMetrics[SystemMetricType.PHYSICAL_CAPACITY] = 'Physical Capacity';
    this.labelMetrics[SystemMetricType.PHYSICAL_SUBS] = 'Physical Subs';
    this.labelMetrics[SystemMetricType.AVAILABLE_CAPACITY] = 'Available Capacity';
    this.labelMetrics[SystemMetricType.LOGICAL_USAGE] = 'Logical Used';
    this.labelMetrics[SystemMetricType.PHYSICAL_USAGE] = 'Physical Used';
    this.labelMetrics[SystemMetricType.COMPRESS_RATIO] = 'Compression Ratio';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        let id = +params.get('id');
        if (id === 0) {
          id = 1;
        }
        this.internalInit(id);
        this.bus.announceDatacenter(id);
      }
    );
    this.bus.datacenterAnnouncement$.subscribe(
      id => {
        this.internalInit(id);
      }
    );
    this.aggregateService.aggregatedStatistics$.subscribe(
      stats => {
        this.aggregatedStats = stats;
      }
    );
    this.periodService.announceEnablePeriod(false);

  }

  getSystemStatistics(systemName: string): SystemAggregatedStatistics {
    return this.aggregatedStats.find(stats => stats.system === systemName);
  }

  internalInit(id: number): void {
    this.currentDataCenterId = id;
    this.data = this.getTableData(id);
    if (!this.selectedPools.hasOwnProperty(this.currentDataCenterId)) {
      this.selectedPools[this.currentDataCenterId] = [];
    }
    if (!this.collapsedRows.hasOwnProperty(this.currentDataCenterId)) {
      this.collapsedRows[this.currentDataCenterId] = [];
    }
  }

  getTableData(id: number): SystemPool[] {
    this.metricService.getCapacityStatistics(id).subscribe(
      data => {
        this.data = this.recalculateSorting(data.systems, SortType.ASC, null);
        // this.data = data.systems;
        this.data.forEach(system => {
          system.pools.forEach(pool => {
            this.poolMetrics[pool.name] = pool.metrics;
          });
        });
        this.aggregateService.aggregateStatsBySystems(this.selectedPools[this.currentDataCenterId], this.poolMetrics);
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

  isSelectedPool(poolName: string): boolean {
    return this.selectedPools[this.currentDataCenterId].findIndex(pool => pool.poolName === poolName) > -1;
  }

  selectPool(poolName: string, systemName: string): void {

    if (this.selectedPools[this.currentDataCenterId] === undefined) {
      this.selectedPools[this.currentDataCenterId] = [];
    }

    const index = this.selectedPools[this.currentDataCenterId].findIndex(pool => pool.poolName === poolName);

    if (index >= 0) {
      this.selectedPools[this.currentDataCenterId].splice(index, 1);
    } else {
      this.selectedPools[this.currentDataCenterId].push({poolName: poolName, systemName: systemName});
    }
    // @ts-ignore
    this.selectedPools.save();
    this.aggregateService.aggregateStatsBySystems(this.selectedPools[this.currentDataCenterId], this.poolMetrics);
  }

  addCollapsed(systemName: string) {
    if (!this.collapsedRows.hasOwnProperty(this.currentDataCenterId)) {
      this.collapsedRows[this.currentDataCenterId] = [];
    }
    const index = this.collapsedRows[this.currentDataCenterId].findIndex(name => name === systemName);
    if (index > -1) {
      this.collapsedRows[this.currentDataCenterId].splice(index, 1);
    } else {
      this.collapsedRows[this.currentDataCenterId].push(systemName);
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapsed(systemName: string): boolean {
    return this.collapsedRows[this.currentDataCenterId].findIndex(value => value === systemName) > -1;
  }

  collapseAll() {
    if (this.isCollapseAll()) {
      this.collapsedRows[this.currentDataCenterId] = [];
    } else {
      this.collapsedRows[this.currentDataCenterId] = this.data.map(value => value.name);
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapseAll(): boolean {
    return this.collapsedRows[this.currentDataCenterId].length === this.data.length;
  }

  isSelectedAll(): boolean {
    return this.selectedPools[this.currentDataCenterId].length === this.data.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.pools.length;
    }, 0);
  }

  getSelectedCount(): number {
    return this.selectedPools[this.currentDataCenterId].length;
  }

  selectAll() {
    if (this.isSelectedAll()) {
      this.selectedPools[this.currentDataCenterId] = [];
    } else {
      this.selectedPools[this.currentDataCenterId] = [];
      this.data.forEach(system => system.pools.forEach(
        pool => this.selectedPools[this.currentDataCenterId].push({poolName: pool.name, systemName: system.name})
      ));
    }
    // @ts-ignore
    this.selectedPools.save();
    this.aggregateService.aggregateStatsBySystems(this.selectedPools[this.currentDataCenterId], this.poolMetrics);
  }

  isPartiallySelected() {
    return this.selectedPools[this.currentDataCenterId].length > 0;
  }

  getSystemPools(systemName): SystemPool {
    return this.data.find(system => system.name === systemName);
  }

  isAlertingSystem(systemName: string): boolean {
    if (this.data.length > 0) {
      return this.alertsDefinition
        .find(
          definition => {
            const systemPool = this.getSystemPools(systemName);
            if (systemPool !== undefined) {
              return systemPool.pools.find(pool => this.checkAlert(pool, definition)) !== undefined;
            }
            return false;
          }
        ) !== undefined;
    }
    return false;
  }

  isAlertingPool(systemPool: SystemDetail) {
    return this.alertsDefinition
      .find(definition => {
        return this.checkAlert(systemPool, definition);
      }) !== undefined;
  }

  checkAlert(systemPool: SystemDetail, definition): boolean {
    if (systemPool !== null) {
      const metric = this.getMetric(systemPool.metrics, definition.type);
      if (metric != null) {
        return metric.value > definition.threshold.min && metric.value <= definition.threshold.max;
      }
    }
    return false;
  }

  getAlertType(systemPool: SystemDetail, type: SystemMetricType) {
    const alertDefinition = this.alertsDefinition
      .find(definition => {
        return this.checkAlert(systemPool, definition) && definition.type === type;
      });
    if (alertDefinition === undefined) {
      return 'alert-ok';
    } else {
      return alertDefinition.threshold.alertType;
    }
  }

  getOccuredAlert(systemPool: SystemDetail, type: SystemMetricType) {
    return this.alertsDefinition
      .find(definition => {
        return this.checkAlert(systemPool, definition) && definition.type === type;
      });
  }

  getAlertMessage(systemPool: SystemDetail, type: SystemMetricType) {

    const alertDefinition = this.getOccuredAlert(systemPool, type);

    if (alertDefinition !== undefined) {
      return this.getColumnLabel(type) + ' is over ' + alertDefinition.threshold.min + ' for ' + systemPool.name;
    }
    return '';

  }

  getMetricTooltip(systemPool: SystemDetail, type: SystemMetricType) {
    const tooltip = this.getAlertMessage(systemPool, type);
    if (tooltip === '') {
      return this.getColumnLabel(type);
    }
    return tooltip;
  }

  getData() {
    return this.data;
  }

  setData(data: SystemPool[]) {
    this.data = data;
  }

  recalculateSorting(data: SystemPool[], sortType, sortColumn): SystemPool[] {
    let dataReturned = [];

    if (sortColumn === null) {
      dataReturned = data.map(system => {
        system.pools = system.pools.sort((poolA, poolB) => this.compare(poolA.name, poolB.name));
        return system;
      });
      dataReturned = dataReturned.sort(
        (systemA, systemB) => {
          return this.compare(systemA.name, systemB.name);
        }
      );
    } else {
      dataReturned = data.map(system => {
        system.pools = system.pools.sort(
          (poolA, poolB) => {
            if (sortType === SortType.ASC) {
              return this.compare(this.findMetric(poolA, sortColumn).value, this.findMetric(poolB, sortColumn).value);
            } else {
              return this.compare(this.findMetric(poolB, sortColumn).value, this.findMetric(poolA, sortColumn).value);
            }
          }
        );
        return system;
      });
    }
    return dataReturned;
  }

  findMetric(pool: SystemDetail, metricType: SystemMetricType) {
    return pool.metrics.find(metric => metric.type === metricType);
  }

  compare(valueA, valueB) {
    if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    }
    return 0;
  }
}
