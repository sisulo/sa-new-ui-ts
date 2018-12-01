import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../../metric.service';
import {BusService} from '../bus.service';
import {SystemPool} from '../../../models/SystemPool';
import {SystemMetric} from '../../../models/metrics/SystemMetric';

@Component({
  selector: 'app-capacity-statistics',
  templateUrl: './capacity-statistics.component.html',
  styleUrls: ['./capacity-statistics.component.css']
})
export class CapacityStatisticsComponent implements OnInit {

  data: SystemPool[] = []; // Todo caching data by datacenters
  tableData = [];
  selectedPools = [];
  poolMetrics = [];
  summarizedValues = {
    physicalSubstitution: 0,
    physicalCapacity: 0,
    availableCapacity: 0,
    logicalUsed: 0,
    physicalUsed: 0,
    compressionRatio: 0
  };

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
        this.data = this.getTableData(id);
        this.bus.announceDatacenter(id);
      }
    );
    this.bus.datacenterAnnouncement$.subscribe(
      id => {
        this.data = this.getTableData(id);
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
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

  selectPool(poolName: string): void {
    const index = this.selectedPools.findIndex(pool => pool === poolName);
    if (index >= 0) {
      this.selectedPools.splice(index, 1);
    } else {
      this.selectedPools.push(poolName);
    }
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
    this.selectedPools.forEach(
      poolName => {
        const physicalCapacity = this.getMetricByName(this.poolMetrics[poolName], 'Physical capacity');
        this.summarizedValues.physicalCapacity += physicalCapacity;
        this.summarizedValues.physicalSubstitution += this.getMetricByName(this.poolMetrics[poolName], 'Physical subs') * physicalCapacity;
        this.summarizedValues.availableCapacity += this.getMetricByName(this.poolMetrics[poolName], 'Available capacity');
        this.summarizedValues.logicalUsed += this.getMetricByName(this.poolMetrics[poolName], 'Logical used') * physicalCapacity;
        this.summarizedValues.physicalUsed += this.getMetricByName(this.poolMetrics[poolName], 'Physical used') * physicalCapacity;
        this.summarizedValues.compressionRatio += this.getMetricByName(this.poolMetrics[poolName], 'Compression ratio') * physicalCapacity;

      }
    );
    this.summarizedValues.physicalSubstitution = this.summarizedValues.physicalSubstitution / this.summarizedValues.physicalCapacity;
    this.summarizedValues.logicalUsed = this.summarizedValues.logicalUsed / this.summarizedValues.physicalCapacity;
    this.summarizedValues.physicalUsed = this.summarizedValues.physicalUsed / this.summarizedValues.physicalCapacity;
    this.summarizedValues.compressionRatio = this.summarizedValues.compressionRatio / this.summarizedValues.physicalCapacity;

    console.log(this.summarizedValues);
  }

  getMetricByName(metrics: SystemMetric[], name: string) {
    return metrics
      .find(metric => metric.name === name)
      .value;
  }

  // getMetricObject(systemName: string, metricName: string): SystemMetric {
  //   return this.data
  //     .find(system => system.name === systemName).pools
  //     .find(data => {
  //         return data.name === metricName;
  //       }
  //     );
  // }

}
