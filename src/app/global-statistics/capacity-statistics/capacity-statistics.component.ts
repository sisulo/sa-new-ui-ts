import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../metric.service';
import {BusService} from '../bus.service';
import {SystemPool} from '../../common/models/SystemPool';
import {AggregatedStatisticsService} from './aggregated-statistics.service';
import {SystemAggregatedStatistics} from '../utils/WeightedArithmeticMean';
import {PeriodService} from '../../period.service';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SystemDetail} from '../../common/models/SystemDetail';
import {SortType} from '../div-table/div-table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DivTableGrouped} from '../div-table/div-table-grouped';


export class ItemKey {
  systemName: string;
  poolName: string;
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
      state('true', style({height: '0px', display: 'none', opacity: 0})),
      state('false', style({height: '*', opacity: 1})),
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
export class CapacityStatisticsComponent extends DivTableGrouped implements OnInit {

  dataWidth = 80;
  types = [
    SystemMetricType.PHYSICAL_SUBS,
    SystemMetricType.PHYSICAL_CAPACITY,
    SystemMetricType.AVAILABLE_CAPACITY,
    SystemMetricType.LOGICAL_USAGE,
    SystemMetricType.PHYSICAL_USAGE,
    SystemMetricType.COMPRESS_RATIO
  ];
  data: SystemPool[] = []; // Todo caching data by dataCenters

  poolMetrics = {};
  aggregatedStats: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();
  alertsDefinition = [
    {type: SystemMetricType.PHYSICAL_USAGE, threshold: {alertType: 'text-orange', min: 80, max: 90}},
    {type: SystemMetricType.PHYSICAL_USAGE, threshold: {alertType: 'text-red', min: 90, max: 10000}}
  ];


  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService,
    protected bus: BusService,
    private aggregateService: AggregatedStatisticsService,
  ) {
    super(route, router, periodService, metricService, bus);
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
        return metric.value > definition.threshold.min && metric.value < definition.threshold.max;
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

  getWidth() {
    return 'width: ' + this.dataWidth / this.types.length + '%';
  }
}
