import {Component, OnInit} from '@angular/core';
import {DivTableGrouped} from '../div-table/div-table-grouped';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../period.service';
import {MetricService, PeriodType} from '../../metric.service';
import {BusService} from '../bus.service';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SystemPool} from '../../common/models/SystemPool';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DateUtil} from '../utils/DateUtils';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';


@Component({
  selector: 'app-dp-sla',
  templateUrl: './dp-sla.component.html',
  styleUrls: ['./dp-sla.component.css', '../global-statistics.component.css'],
  animations: [
    trigger('slideInOut', [
      state('true', style({height: '0px', display: 'none', opacity: 0})),
      state('false', style({height: '*', opacity: 1})),
      transition('1 => 0', animate('500ms ease-in')),
      transition('0 => 1', animate('500ms ease-out'))
    ]),
    trigger('iconRotate', [
      state('false', style({transform: 'rotate(0deg)'})),
      state('true', style({transform: 'rotate(90deg)'})),
      transition('1 => 0', animate('500ms')),
      transition(':enter', animate('0ms')),
      transition(':leave', animate('0ms')),
      transition('0 => 1', animate('500ms'))
    ])
  ]
})
export class DpSlaComponent extends DivTableGrouped implements OnInit {

  types = [
    SystemMetricType.SLA_EVENTS,
    SystemMetricType.OUT_OF_SLA_TIME
  ];
  currentPeriod: PeriodType = PeriodType.DAY;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService,
    protected bus: BusService,
  ) {
    super(route, router, periodService, metricService, bus);

    this.labelMetrics[SystemMetricType.SLA_EVENTS] = 'SLA Events';
    this.labelMetrics[SystemMetricType.OUT_OF_SLA_TIME] = 'Out of SLA Time';

  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        let id = +params.get('id');
        if (id === 0) {
          id = 1;
        }
        this.internalInit(id);
        this.bus.announceDatacenter(id);
      }
    );
    this.bus.datacenterAnnouncement$.subscribe(
      id => {
        this.internalInit(id);
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

  getData(): SystemPool[] {
    return <SystemPool[]> this.data;
  }

  recalculateSorting(data, sortType, sortColumn) {
  }

  setData(data: SystemPool[]) {
    this.data = data;
  }

  getTableData(id: number): any[] {
    this.metricService.getDpSlaStatistics(id, this.currentPeriod).subscribe(
      data => {
        this.setData(data.systems);
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

  getFormattedMetric(metrics: SystemMetric[], type: SystemMetricType) {
    if (type === SystemMetricType.OUT_OF_SLA_TIME) {
      return DateUtil.transform(this.getMetric(metrics, type).value);
    } else {
      return this.getMetric(metrics, type).value;
    }
  }
}
