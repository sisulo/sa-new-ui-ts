import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../../period.service';
import {MetricService, PeriodType} from '../../../metric.service';
import {SystemMetricType} from '../../../common/models/metrics/system-metric-type.enum';
import {SystemPool} from '../../../common/models/system-pool.vo';
import {BusService} from '../../bus.service';
import {SasiColumnBuilder, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {RouteLinkFormatterComponent} from '../../../common/components/route-link-formatter/route-link-formatter.component';
import {AlertFormatterComponent} from '../../formatters/alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {TimeFormatterComponent} from '../../formatters/time-formatter/time-formatter.component';
import {SumValueServiceImpl} from '../../utils/sum-value-service.impl';
import {GroupSortAggregateValueImpl} from '../../../common/components/sasi-table/group-sort-aggregate-value.impl';
import {MetricHandlerUtils} from '../../utils/metric-handler.utils';
import {StorageEntityMetricDto} from '../../../common/models/dtos/storage-entity-metric.dto';
import {SeTextFormatterComponent} from '../../../storage-configuration/se-text-formatter/se-text-formatter.component';


@Component({
  selector: 'app-dp-sla',
  templateUrl: './dp-sla-2.component.html',
  styleUrls: ['./dp-sla.component.css', '../../global-statistics.component.css']
})
export class DpSlaComponent implements OnInit, OnDestroy {

  types = [
    SystemMetricType.SLA_EVENTS,
    SystemMetricType.OUT_OF_SLA_TIME
  ];
  currentPeriod: PeriodType = PeriodType.WEEK;

  options: SasiTableOptions = new SasiTableOptions();

  data: StorageEntityMetricDto[] = []; // TODO duplicated in all Global statistics - grouped
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
        .withComponent(RouteLinkFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.SLA_EVENTS)
        .withLabel('SLA Events')
        .withColumnTooltipText('Count of breach SLA occuracnces per DP Pool. SLA treshold = >1ms write response time for at least 10mins time period')
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.OUT_OF_SLA_TIME)
        .withLabel('Out of SLA Time')
        .withColumnTooltipText('Total time of breach SLA occuracnces per DP Pool.')
        .withComponent(TimeFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('sortId')
        .withLabel('Sort ID')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withHidden(true)
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
    this.options.sortService = new GroupSortAggregateValueImpl();
    this.options.sortColumnNames = ['sortId', 'name'];
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
        if (this.currentPeriod !== period) {
          this.currentPeriod = period;
          this.getTableData(this.currentDataCenterId);
        }
      }
    );
    this.periodService.announceEnablePeriod(true);
    this.periodService.announcePeriod(this.currentPeriod);
  }

  ngOnDestroy(): void {
    this.periodService.announceEnablePeriod(false);
  }

  getTableData(id: number): StorageEntityMetricDto[] { // TODO duplicated for all GS sasi tables
    this.currentDataCenterId = id;
    this.metricService.getDpSlaStatistics(id, this.currentPeriod).subscribe(
      data => this.data = MetricHandlerUtils.success(data),
      error => this.data = MetricHandlerUtils.error(error)
    );
    return this.data;
  }
}
