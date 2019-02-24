import {Component, OnInit} from '@angular/core';
import {MetricService, PeriodType} from '../../metric.service';
import {SystemDetail} from '../../common/models/SystemDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {PeriodService} from '../../period.service';
import {BusService} from '../bus.service';
import {SasiColumn, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';
import {RouteLinkFormatterComponent} from '../route-link-formatter/route-link-formatter.component';
import {AlertFormatterComponent} from '../alert-formatter/alert-formatter.component';
import {AlertRule, Threshold} from '../AlertRule';
import {RowTableComponent} from '../../common/components/sasi-table/row-table/row-table.component';

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
    this.options.columns.push(new SasiColumn('name', 'System', RouteLinkFormatterComponent, false));
    this.options.columns.push(new SasiColumn(SystemMetricType.WORKLOAD, 'Workload', UnitFormatterComponent, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.TRANSFER, 'Transfer', UnitFormatterComponent, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.RESPONSE, 'Response', UnitFormatterComponent, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.CPU, 'CPU', UnitFormatterComponent, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.HDD, 'HDD', UnitFormatterComponent, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.WRITE_PENDING, 'Write Pending', UnitFormatterComponent, true));
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowTableComponent;
    this.options.labelColumnWidth = '13.78';
    this.options.valueColumnWidth = '13.78';

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
