import {Component, OnInit} from '@angular/core';
import {MetricService, PeriodType} from '../../metric.service';
import {SystemDetail} from '../../common/models/SystemDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {PeriodService} from '../../period.service';
import {DivTable, SortType} from '../div-table/div-table';

@Component({
  selector: 'app-tab',
  templateUrl: './performance-statistics.component.html',
  styleUrls: ['./performance-statistics.component.css', '../global-statistics.component.css'],
})
export class PerformanceStatisticsComponent extends DivTable implements OnInit {
  currentPeriod: PeriodType = PeriodType.DAY;
  data: SystemDetail[] = []; // Todo caching data by datacenters
  tableData = [];
  alertsDefinition = [];
  sortByPeak = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private periodService: PeriodService
  ) {
    super();

    this.types.push(SystemMetricType.WORKLOAD);
    this.types.push(SystemMetricType.TRANSFER);
    this.types.push(SystemMetricType.RESPONSE);
    this.types.push(SystemMetricType.CPU);
    this.types.push(SystemMetricType.HDD);
    this.types.push(SystemMetricType.WRITE_PENDING);

    this.labelMetrics[SystemMetricType.WORKLOAD] = 'Workload';
    this.labelMetrics[SystemMetricType.TRANSFER] = 'Transfer';
    this.labelMetrics[SystemMetricType.RESPONSE] = 'Response';
    this.labelMetrics[SystemMetricType.CPU] = 'CPU';
    this.labelMetrics[SystemMetricType.HDD] = 'HDD';
    this.labelMetrics[SystemMetricType.WRITE_PENDING] = 'Write Pending';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.data = this.getTableData(id);
      }
    );
    this.periodService.periodAnnouncement$.subscribe(
      period => {
        this.currentPeriod = period;
        this.getTableData(this.currentDataCenterId);
      }
    );
    this.periodService.announceEnablePeriod(true);

    this.alertsDefinition.push({type: SystemMetricType.CPU, threshold: 80});
    this.alertsDefinition.push({type: SystemMetricType.WRITE_PENDING, threshold: 30});
  }


  getTableData(id: number): SystemDetail[] {
    this.currentDataCenterId = id;
    this.metricService.getPerformanceStatistics(id, this.currentPeriod).subscribe(
      data => {
        this.data = data.systems;
        this.tableData = this.data.map(system => this.convertToTableData(system));
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }


  convertToTableData(rawData: SystemDetail): {} {
    const result = {};
    for (const metric of rawData.metrics) {
      result[metric.type] = metric.value;
    }
    result['name'] = rawData.name;
    return result;
  }

  getMetricObject(systemName: string, type: SystemMetricType): SystemMetric {
    if (this.data.length > 0) {
      const metric = this.data
        .find(system => system.name === systemName).metrics
        .find(data => {
            return data.type === type;
          }
        );
      return metric;
    }
    return null;
  }


  isAlertingSystem(systemName: string) {
    if (this.data.length > 0) {
      return this.alertsDefinition
        .find(
          (definition) => {
            const metricFound = this.getMetricObject(systemName, definition.type);
            if (metricFound !== undefined) {
              return metricFound.value > definition.threshold;
            } else {
              return false;
            }
          }
        ) !== undefined;
    }
    return false;
  }

  isAlertingMetric(systemName: string, type: SystemMetricType) {
    if (this.data.length > 0) {
      const metric = this.getMetricObject(systemName, type);
      if (metric != null) {
        const definition = this.alertsDefinition.find((definitionObj) => type === definitionObj.type);
        if (definition !== undefined) {
          return metric.value > definition.threshold;
        }
      }
    }
    return false;
  }

  getAlertDefinition(type: SystemMetricType) {
    return this.alertsDefinition.find((definitionObj) => type === definitionObj.type);
  }

  getAlertMessage(systemName: string, type: SystemMetricType): string {
    if (this.isAlertingMetric(systemName, type)) {
      const alertDefinition = this.getAlertDefinition(type);
      const metric = this.getMetricObject(systemName, type);
      return this.getColumnLabel(type) + ' is over ' + alertDefinition.threshold + metric.unit + ' in system ' + systemName;
    } else {
      return '';
    }
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  setPeakSort(column, isPeak) {
    this.sortByPeak = isPeak;
    super.setSort(column);
  }

  getPeakSortIconClass(column: SystemMetricType, isPeak: boolean) {
    const classIcon = this.getSortIconClass(column);
    if (isPeak === this.sortByPeak) {
      return classIcon;
    } else {
      return 'fa-sort';
    }
  }

  recalculateSorting(data: SystemDetail[], sortType, sortColumn) {
    const dataReturned = data.sort(
      (poolA, poolB) => {
        if (sortColumn === null) {
          if (sortType === SortType.ASC) {
            return this.compare(poolA.name, poolB.name);
          } else {
            return this.compare(poolB.name, poolA.name);
          }
        } else {
          if (sortType === SortType.ASC) {
            if (this.sortByPeak === true) {
              return this.compare(this.findMetric(poolA, sortColumn).peak, this.findMetric(poolB, sortColumn).peak);
            } else {
              return this.compare(this.findMetric(poolA, sortColumn).value, this.findMetric(poolB, sortColumn).value);
            }
          } else {
            if (this.sortByPeak === true) {
              return this.compare(this.findMetric(poolB, sortColumn).peak, this.findMetric(poolA, sortColumn).peak);
            } else {
              return this.compare(this.findMetric(poolB, sortColumn).value, this.findMetric(poolA, sortColumn).value);
            }
          }
        }
      }
    );
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
