import {Component, OnInit} from '@angular/core';
import {MetricService, PeriodType} from '../../metric.service';
import {SystemDetail} from '../../common/models/SystemDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {PeriodService} from '../../period.service';
import {BusService} from '../bus.service';
import {SasiColumn, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';
import {RouteLinkFormatterComponent} from '../simple-unit-formatter/route-link-formatter.component';
import {AlertFormatterComponent} from '../alert-formatter/alert-formatter.component';
import {AlertRule, Threshold} from '../AlertRule';

@Component({
  selector: 'app-tab',
  templateUrl: './performance-statistics.component.html',
  styleUrls: ['./performance-statistics.component.css', '../global-statistics.component.css'],
})
export class PerformanceStatisticsComponent implements OnInit {

  currentPeriod: PeriodType = PeriodType.DAY;
  data: SystemDetail[] = []; // Todo caching data by datacenters
  options: SasiTableOptions = new SasiTableOptions();
  currentDataCenterId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private periodService: PeriodService,
    private bus: BusService
  ) {
    this.options.columns.push(new SasiColumn('name', 'System', RouteLinkFormatterComponent));
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

    this.options.cellDecoratorRules.push(new AlertRule(SystemMetricType.CPU, new Threshold('text-orange', 80, 10000)));
    this.options.cellDecoratorRules.push(new AlertRule(SystemMetricType.WRITE_PENDING, new Threshold('text-orange', 30, 10000)));
  }


  getTableData(id: number): SystemDetail[] {
    this.currentDataCenterId = id;
    this.metricService.getPerformanceStatistics(id, this.currentPeriod).subscribe(
      data => {
        this.data = data.systems;
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }
}
