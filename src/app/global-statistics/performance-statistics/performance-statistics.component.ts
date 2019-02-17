import {Component, OnInit} from '@angular/core';
import {MetricService, PeriodType} from '../../metric.service';
import {SystemDetail} from '../../common/models/SystemDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {PeriodService} from '../../period.service';
import {DivTable, SortType} from '../div-table/div-table';
import {BusService} from '../bus.service';
import {SasiColumn, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';
import {SimpleUnitFormatterComponent} from '../simple-unit-formatter/simple-unit-formatter.component';
import {AlertFormatterComponent} from '../alert-formatter/alert-formatter.component';

@Component({
  selector: 'app-tab',
  templateUrl: './performance-statistics.component.html',
  styleUrls: ['./performance-statistics.component.css', '../global-statistics.component.css'],
})
export class PerformanceStatisticsComponent implements OnInit {

  currentPeriod: PeriodType = PeriodType.DAY;
  data: SystemDetail[] = []; // Todo caching data by datacenters
  tableData = [];
  alertsDefinition = [];
  options: SasiTableOptions = new SasiTableOptions();
  currentDataCenterId;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private periodService: PeriodService,
    private bus: BusService
  ) {
    this.options.columns.push(new SasiColumn('name', 'System', SimpleUnitFormatterComponent));
    this.options.columns.push(new SasiColumn(SystemMetricType.WORKLOAD, 'Workload', UnitFormatterComponent));
    this.options.columns.push(new SasiColumn(SystemMetricType.TRANSFER, 'Transfer', UnitFormatterComponent));
    this.options.columns.push(new SasiColumn(SystemMetricType.RESPONSE, 'Response', UnitFormatterComponent));
    this.options.columns.push(new SasiColumn(SystemMetricType.CPU, 'CPU', UnitFormatterComponent));
    this.options.columns.push(new SasiColumn(SystemMetricType.HDD, 'HDD', UnitFormatterComponent));
    this.options.columns.push(new SasiColumn(SystemMetricType.WRITE_PENDING, 'Write Pending', UnitFormatterComponent));
    this.options.colControlFormatter = AlertFormatterComponent;

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bus.announceDatacenter(id);
        this.bus.announceContext('performance');
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

    // TODO extract rule to class
    this.options.cellDecoratorRules.push({type: SystemMetricType.CPU, threshold: 80});
    this.options.cellDecoratorRules.push({type: SystemMetricType.WRITE_PENDING, threshold: 30});
    //
    // this.alertsDefinition.push({type: SystemMetricType.CPU, threshold: 80});
    // this.alertsDefinition.push({type: SystemMetricType.WRITE_PENDING, threshold: 30});
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
      return 'Metric is over ' + alertDefinition.threshold + metric.unit + ' in system ' + systemName;
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

  compare(valueA, valueB) {
    if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    }
    return 0;
  }
}
