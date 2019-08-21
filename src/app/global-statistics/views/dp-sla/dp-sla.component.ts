import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../../period.service';
import {MetricService, PeriodType} from '../../../metric.service';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {SystemPool} from '../../../common/models/SystemPool';
import {BusService} from '../../bus.service';
import {SasiColumnBuilder, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {RouteLinkFormatterComponent} from '../../formatters/route-link-formatter/route-link-formatter.component';
import {AlertFormatterComponent} from '../../formatters/alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {TimeFormatterComponent} from '../../formatters/time-formatter/time-formatter.component';
import {SumValueServiceImpl} from '../../utils/SumValueServiceImpl';
import {GroupSortImpl} from '../../../common/components/sasi-table/group-sort-impl';
import {EmphFormatterComponent} from '../../formatters/emph-formatter/emph-formatter.component';


@Component({
  selector: 'app-dp-sla',
  templateUrl: './dp-sla-2.component.html',
  styleUrls: ['./dp-sla.component.css', '../../global-statistics.component.css']
})
export class DpSlaComponent implements OnInit {

  types = [
    SystemMetricType.SLA_EVENTS,
    SystemMetricType.OUT_OF_SLA_TIME
  ];
  currentPeriod: PeriodType = PeriodType.DAY;

  options: SasiTableOptions = new SasiTableOptions();

  data: SystemPool[] = []; // TODO duplicated in all Global statistics - grouped
  currentDataCenterId; // TODO duplicated iin all Global statistics

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService,
    protected bus: BusService
  ) {

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withLabel('System')
        .withComponent(EmphFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.SLA_EVENTS)
        .withLabel('SLA Events')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.OUT_OF_SLA_TIME)
        .withLabel('Out of SLA Time')
        .withComponent(TimeFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.labelColumnWidth = '25';
    this.options.valueColumnWidth = '35.75';
    this.options.aggregateValuesService = new SumValueServiceImpl();
    this.options.sortService = new GroupSortImpl();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bus.announceDatacenter(id);
        this.bus.announceContext('dp-sla');
        this.getTableData(id); // TODO initInternal removed, check collapse/select behavior
      }
    );
    this.periodService.periodAnnouncement$.subscribe(
      period => {
        this.currentPeriod = period;
        this.getTableData(this.currentDataCenterId);
      }
    );
    this.periodService.announceEnablePeriod(true);
  }

  getTableData(id: number): any[] { // TODO duplicated for all GS sasi tables
    this.currentDataCenterId = id;
    this.metricService.getDpSlaStatistics(id, this.currentPeriod).subscribe(
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
