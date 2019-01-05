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
import {System} from '../../common/models/System';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';


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
  styleUrls: ['./capacity-statistics.component.css']
})
export class CapacityStatisticsComponent implements OnInit {

  labelMetrics: {} = {};
  types = [];
  data: SystemPool[] = []; // Todo caching data by dataCenters
  currentDataCenterId = 0;
  poolMetrics = {};
  aggregatedStats: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();
  @LocalStorage() selectedPools: SelectedItems = {};
  @LocalStorage() collapsedRows: CollapsedItems = {};
  private currentColumn = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private bus: BusService,
    private aggregateService: AggregatedStatisticsService,
    private periodService: PeriodService
  ) {
    this.types.push(SystemMetricType.PHYSICAL_SUBS);
    this.types.push(SystemMetricType.PHYSICAL_CAPACITY);
    this.types.push(SystemMetricType.AVAILABLE_CAPACITY);
    this.types.push(SystemMetricType.LOGICAL_USAGE);
    this.types.push(SystemMetricType.PHYSICAL_USAGE);
    this.types.push(SystemMetricType.COMPRESS_RATIO);

    this.labelMetrics[SystemMetricType.PHYSICAL_CAPACITY] = 'Physical capacity';
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
        console.log(stats);
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
        this.data = data.systems;
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

  setCurrentColumn(column: number) {
    this.currentColumn = column;
  }

  isCurrentColumn(column: number) {
    return column === this.currentColumn;
  }

  getColumnLabel(type: SystemMetricType) {
    return this.labelMetrics[type];
  }

  getMetric(metrics: SystemMetric[], metricName: SystemMetricType): SystemMetric {
    return metrics.find(metric => metric.type === metricName);
  }
}
