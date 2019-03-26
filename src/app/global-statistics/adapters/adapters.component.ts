import {Component, OnInit} from '@angular/core';
import {DivTableGrouped} from '../div-table/div-table-grouped';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../period.service';
import {MetricService, PeriodType} from '../../metric.service';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SystemPool} from '../../common/models/SystemPool';
import {SortType} from '../div-table/div-table';
import {SystemDetail} from '../../common/models/SystemDetail';
import {BusService} from '../bus.service';
import {SasiColumn, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {RouteLinkFormatterComponent} from '../route-link-formatter/route-link-formatter.component';
import {SimpleFormatterComponent} from '../simple-formatter/simple-formatter.component';
import {TimeFormatterComponent} from '../time-formatter/time-formatter.component';
import {AlertFormatterComponent} from '../alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SumValueServiceImpl} from '../utils/SumValueServiceImpl';
import {TextFormatterComponent} from '../text-formatter/text-formatter.component';

// TODO separate components, pipes, utils to own directories
@Component({
  selector: 'app-adapters',
  templateUrl: './adapters.component.html',
  styleUrls: ['./adapters.component.css', '../global-statistics.component.css']
})
export class AdaptersComponent implements OnInit {

  types = [
    SystemMetricType.DISBALANCE_EVENTS,
    SystemMetricType.INFO
  ];
  currentPeriod: PeriodType = PeriodType.DAY;

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

    this.options.columns.push(new SasiColumn('name', 'System', RouteLinkFormatterComponent, false, false));
    this.options.columns.push(new SasiColumn(SystemMetricType.DISBALANCE_EVENTS, 'Disbalance events', SimpleFormatterComponent, false, true));
    this.options.columns.push(new SasiColumn(SystemMetricType.INFO, 'Info', TextFormatterComponent, false, false));
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.labelColumnWidth = '25';
    this.options.valueColumnWidth = '35.75';
    this.options.aggregateValuesService = new SumValueServiceImpl();
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
    this.metricService.getAdaptersStatistics(id, this.currentPeriod).subscribe(
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
