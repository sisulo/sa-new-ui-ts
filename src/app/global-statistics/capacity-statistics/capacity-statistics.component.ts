import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../metric.service';
import {BusService} from '../bus.service';
import {SystemPool} from '../../models/SystemPool';
import {LocalStorage} from 'ngx-store';
import {AggregatedStatisticsService} from './aggregated-statistics.service';

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

@Component({
  selector: 'app-capacity-statistics',
  templateUrl: './capacity-statistics.component.html',
  styleUrls: ['./capacity-statistics.component.css']
})
export class CapacityStatisticsComponent implements OnInit {

  data: SystemPool[] = []; // Todo caching data by dataCenters
  currentDataCenterId = 0;
  poolMetrics = [];
  @LocalStorage() selectedPools: SelectedItems = {};
  @LocalStorage() collapsedRows: CollapsedItems = {};
  private currentColumn = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private bus: BusService,
    private aggregateService: AggregatedStatisticsService
  ) {
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
        console.log(this.data);
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
    this.aggregateService.announceFilter(this.selectedPools[this.currentDataCenterId]);
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
    this.aggregateService.announceFilter(this.selectedPools[this.currentDataCenterId]);
  }

  setCurrentColumn(column: number) {
    this.currentColumn = column;
  }

  isCurrentColumn(column: number) {
    return column === this.currentColumn;
  }
}
