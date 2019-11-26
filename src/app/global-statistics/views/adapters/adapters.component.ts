import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../../period.service';
import {MetricService, PeriodType} from '../../../metric.service';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {SystemPool} from '../../../common/models/SystemPool';
import {BusService} from '../../bus.service';
import {SasiColumnBuilder, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {RouteLinkFormatterComponent} from '../../../common/components/route-link-formatter/route-link-formatter.component';
import {AlertFormatterComponent} from '../../formatters/alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SumValueServiceImpl} from '../../utils/SumValueServiceImpl';
import {DisbalanceFormatterComponent} from '../../formatters/disbalance-formatter/disbalance-formatter.component';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {GroupSortAggregateValueImpl} from '../../../common/components/sasi-table/group-sort-aggregate-value.impl';

// TODO separate components, pipes, utils to own directories
@Component({
  selector: 'app-adapters',
  templateUrl: './adapters.component.html',
  styleUrls: ['./adapters.component.css', '../../global-statistics.component.css']
})
export class AdaptersComponent implements OnInit {

  types = [
    SystemMetricType.IMBALANCE_EVENTS,
    SystemMetricType.IMBALANCE_PERC
  ];
  currentPeriod: PeriodType = PeriodType.WEEK;

  options: SasiTableOptions = new SasiTableOptions();
  data: SystemPool[] = [];
  currentDataCenterId;

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
        .withAltLabel('System')
        .withLabel('Cha pair')
        .withComponent(RouteLinkFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.IMBALANCE_EVENTS)
        .withLabel('Cha Imbalance events')
        .withComponent(SimpleFormatterComponent)
        // .withAggComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PORT_IMBALANCE_EVENTS)
        .withLabel('Port Imbalance events')
        .withComponent(SimpleFormatterComponent)
        // .withAggComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.IMBALANCE_PERC)
        .withLabel('Details')
        .withComponent(DisbalanceFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.labelColumnWidth = '23';
    this.options.valueColumnWidth = '24.49';
    this.options.aggregateValuesService = new SumValueServiceImpl();
    this.options.sortService = new GroupSortAggregateValueImpl();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        const id = +params.get('id');
        this.bus.announceDatacenter(id);
        this.bus.announceContext('adapters');
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
    this.periodService.announcePeriod(this.currentPeriod);
  }

  getTableData(id: number): any[] { // TODO duplicated for all GS sasi tables
    this.currentDataCenterId = id;
    this.metricService.getAdaptersStatistics(id, this.currentPeriod).subscribe(
      data => {
        this.data = [];
        data.datacenters.forEach(datacenter => this.data = [...this.data, ...datacenter.systems]);
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

}
