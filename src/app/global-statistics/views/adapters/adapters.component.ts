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
import {SumValueServiceImpl} from '../../utils/sum-value-service.impl';
import {PortDisbalanceFormatterComponent} from '../../formatters/port-disbalance-formatter/port-disbalance-formatter.component';
import {SimpleFormatterComponent} from '../../formatters/simple-formatter/simple-formatter.component';
import {GroupSortAggregateValueImpl} from '../../../common/components/sasi-table/group-sort-aggregate-value.impl';
import {AdapterDisbalanceFormatterComponent} from '../../formatters/adapter-disbalance-formatter/adapter-disbalance-formatter.component';
import {EmptyFormatterComponent} from '../../formatters/empty-formatter/empty-formatter.component';
import {MetricHandlerUtils} from '../../utils/metric-handler.utils';
import {StorageEntityMetricDto} from '../../../common/models/dtos/storage-entity-metric.dto';

// TODO separate components, pipes, utils to own directories
@Component({
  selector: 'app-adapters',
  templateUrl: './adapters.component.html',
  styleUrls: ['./adapters.component.css', '../../global-statistics.component.css']
})
export class AdaptersComponent implements OnInit, OnDestroy {

  types = [
    SystemMetricType.IMBALANCE_EVENTS,
    SystemMetricType.IMBALANCE_PERC
  ];
  currentPeriod: PeriodType = PeriodType.WEEK;

  options: SasiTableOptions = new SasiTableOptions();
  data: StorageEntityMetricDto[] = [];
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
        .withComponent(EmptyFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.IMBALANCE_EVENTS)
        .withLabel('Cha Imbalances')
        .withColumnTooltipText('Count of Channel Adapater Pair imbalances. Treshold definition = 10% imbalance AND 20MB/s')
        .withComponent(AdapterDisbalanceFormatterComponent)
        .withAggComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        // .withColumnWidth('12')
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.PORT_IMBALANCE_EVENTS)
        .withLabel('Port Imbalances')
        .withColumnTooltipText('Count of FE Port Pair Imbalances. Treshold definition = 10% imbalance AND 20MB/s')
        .withComponent(PortDisbalanceFormatterComponent)
        .withAggComponent(SimpleFormatterComponent)
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
    this.options.labelColumnWidth = '23';
    this.options.valueColumnWidth = '36.5';
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

  ngOnDestroy(): void {
    this.periodService.announceEnablePeriod(false);
  }

  getTableData(id: number): StorageEntityMetricDto[] { // TODO duplicated for all GS sasi tables
    this.currentDataCenterId = id;
    this.metricService.getAdaptersStatistics(id, this.currentPeriod).subscribe(
      data => {
        this.data = MetricHandlerUtils.success(data);
        // TODO change this filtering. checking first metric for non-null is not good, and make it as some named function for readability
        this.data.forEach(system => system.children.forEach(pool => pool.children = pool.children.filter(port => port.metrics.length > 0 && port.metrics[0].value > 0)));
        this.data.forEach(system => system.children = system.children.filter(pool => (pool.metrics.length > 0 && pool.metrics[0].value > 0) || pool.children.length > 0));
      },
      error => this.data = MetricHandlerUtils.error(error)
    );
    return this.data;
  }

}
