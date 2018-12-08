import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../metric.service';
import {BusService} from '../bus.service';
import {SystemPool} from '../../models/SystemPool';
import {SystemMetric} from '../../models/metrics/SystemMetric';
import {SystemMetricType} from '../../models/metrics/SystemMetricType';
import {LocalStorage} from 'ngx-store';

class SelectedItems {
  [key: string]: Array<string>;
}

@Component({
  selector: 'app-capacity-statistics',
  templateUrl: './capacity-statistics.component.html',
  styleUrls: ['./capacity-statistics.component.css']
})
export class CapacityStatisticsComponent implements OnInit {

  data: SystemPool[] = []; // Todo caching data by datacenters
  tableData = [];
  currentDatacenterId = 0;
  @LocalStorage() selectedPools: SelectedItems = {};
  poolMetrics = [];
  @LocalStorage() collapsedRows: SelectedItems = {};
  summarizedValues = {
    physicalSubstitution: 0,
    physicalCapacity: 0,
    availableCapacity: 0,
    logicalUsed: 0,
    physicalUsed: 0,
    compressionRatio: 0
  };
  private currentColumn = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private bus: BusService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        let id = +params.get('id');
        if (id === 0) {
          id = 1;
        }
        this.currentDatacenterId = id;
        this.data = this.getTableData(id);
        this.bus.announceDatacenter(id);
        if (!this.collapsedRows.hasOwnProperty(this.currentDatacenterId)) {
          this.collapsedRows[this.currentDatacenterId] = [];
        }

        if (!this.selectedPools.hasOwnProperty(this.currentDatacenterId)) {
          this.selectedPools[this.currentDatacenterId] = [];
        }
      }
    );
    this.bus.datacenterAnnouncement$.subscribe(
      id => {
        this.data = this.getTableData(id);
        if (!this.selectedPools.hasOwnProperty(this.currentDatacenterId)) {
          this.selectedPools[this.currentDatacenterId] = [];
        }
        if (!this.collapsedRows.hasOwnProperty(this.currentDatacenterId)) {
          this.collapsedRows[this.currentDatacenterId] = [];
        }
      }
    );

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
        this.tableData = this.data;
        this.computeSummaries();
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

  isSelectedPool(poolName: string): boolean {
    return this.selectedPools[this.currentDatacenterId].findIndex(pool => pool === poolName) > -1;
  }

  selectPool(poolName: string): void {

    if (this.selectedPools[this.currentDatacenterId] === undefined) {
      this.selectedPools[this.currentDatacenterId] = [];
    }

    const index = this.selectedPools[this.currentDatacenterId].findIndex(pool => pool === poolName);

    if (index >= 0) {
      this.selectedPools[this.currentDatacenterId].splice(index, 1);
    } else {
      this.selectedPools[this.currentDatacenterId].push(poolName);
    }
    // @ts-ignore
    this.selectedPools.save();
    this.computeSummaries();
  }

  computeSummaries(): void {

    this.summarizedValues = {
      physicalSubstitution: 0,
      physicalCapacity: 0,
      availableCapacity: 0,
      logicalUsed: 0,
      physicalUsed: 0,
      compressionRatio: 0
    };
    this.selectedPools[this.currentDatacenterId].forEach(
      poolName => {
        const metrics: SystemMetric[] = this.poolMetrics[poolName];
        const physicalCapacity = this.getMetricByName(metrics, SystemMetricType.PHYSICAL_CAPACITY);

        this.summarizedValues.physicalCapacity += physicalCapacity;
        this.summarizedValues.physicalSubstitution += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_SUBS) * physicalCapacity;
        this.summarizedValues.availableCapacity += this.getMetricByName(metrics, SystemMetricType.AVAILABLE_CAPACITY);
        this.summarizedValues.logicalUsed += this.getMetricByName(metrics, SystemMetricType.LOGICAL_USAGE) * physicalCapacity;
        this.summarizedValues.physicalUsed += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_USAGE) * physicalCapacity;
        this.summarizedValues.compressionRatio += this.getMetricByName(metrics, SystemMetricType.COMPRESS_RATIO) * physicalCapacity;

      }
    );
    this.summarizedValues.physicalSubstitution = this.summarizedValues.physicalSubstitution / this.summarizedValues.physicalCapacity;
    this.summarizedValues.logicalUsed = this.summarizedValues.logicalUsed / this.summarizedValues.physicalCapacity;
    this.summarizedValues.physicalUsed = this.summarizedValues.physicalUsed / this.summarizedValues.physicalCapacity;
    this.summarizedValues.compressionRatio = this.summarizedValues.compressionRatio / this.summarizedValues.physicalCapacity;

    console.log(this.summarizedValues);
  }

  getMetricByName(metrics: SystemMetric[], type: SystemMetricType) {
    const metric = metrics.find(item => item.type === type);
    if (metric === undefined) {
      return null;
    }
    return metric.value;
  }

  addCollapsed(systemName: string) {
    if (!this.collapsedRows.hasOwnProperty(this.currentDatacenterId)) {
      this.collapsedRows[this.currentDatacenterId] = [];
    }
    const index = this.collapsedRows[this.currentDatacenterId].findIndex(name => name === systemName);
    if (index > -1) {
      this.collapsedRows[this.currentDatacenterId].splice(index, 1);
    } else {
      this.collapsedRows[this.currentDatacenterId].push(systemName);
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapsed(systemName: string): boolean {
    return this.collapsedRows[this.currentDatacenterId].findIndex(value => value === systemName) > -1;
  }

  collapseAll() {
    if (this.isCollapseAll()) {
      this.collapsedRows[this.currentDatacenterId] = [];
    } else {
      this.collapsedRows[this.currentDatacenterId] = this.data.map(value => value.name);
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapseAll(): boolean {
    return this.collapsedRows[this.currentDatacenterId].length === this.data.length;
  }

  isSelectedAll(): boolean {
    return this.selectedPools[this.currentDatacenterId].length === this.data.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.pools.length;
    }, 0);
  }

  selectAll() {
    if (this.isSelectedAll()) {
      this.selectedPools[this.currentDatacenterId] = [];
    } else {
      this.selectedPools[this.currentDatacenterId] = [];
      this.data.forEach(system => system.pools.forEach(
        pool => this.selectedPools[this.currentDatacenterId].push(pool.name)
      ));
    }
    // @ts-ignore
    this.selectedPools.save();
    this.computeSummaries();
  }

  setCurrentColumn(column: number) {
    this.currentColumn = column;
  }

  isCurrentCoulumn(column: number) {
    return column === this.currentColumn;
  }
}
