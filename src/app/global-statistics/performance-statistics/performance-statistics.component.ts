import {Component, OnInit} from '@angular/core';
import {MetricService, PeriodType} from '../../metric.service';
import {SystemDetail} from '../../common/models/SystemDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {BusService} from '../bus.service';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {PeriodService} from '../../period.service';

@Component({
  selector: 'app-tab',
  templateUrl: './performance-statistics.component.html',
  styleUrls: ['./performance-statistics.component.css'],
})
export class PerformanceStatisticsComponent implements OnInit {
  currentPeriod: PeriodType = PeriodType.DAY;
  currentDatacenter = 0;
  data: SystemDetail[] = []; // Todo caching data by datacenters
  tableData = [];
  alertingSystems = [];
  alertsDefinition = [];
  displayedMetrics: SystemMetricType[] = [
    SystemMetricType.WORKLOAD,
    SystemMetricType.TRANSFER,
    SystemMetricType.RESPONSE,
    SystemMetricType.CPU,
    SystemMetricType.HDD,
    SystemMetricType.WRITE_PENDING
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private bus: BusService,
    private periodService: PeriodService
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
    this.periodService.periodAnnouncement$.subscribe(
      period => {
        this.currentPeriod = period;
        this.getTableData(this.currentDatacenter);
      }
    );
    this.periodService.announceEnablePeriod(true);

    this.alertsDefinition.push({type: SystemMetricType.CPU, threshold: 80});
    this.alertsDefinition.push({type: SystemMetricType.WRITE_PENDING, threshold: 30});
  }


  getTableData(id: number): SystemDetail[] {
    this.currentDatacenter = id;
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


}
