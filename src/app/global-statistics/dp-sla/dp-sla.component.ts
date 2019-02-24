import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../period.service';
import {MetricService, PeriodType} from '../../metric.service';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SystemPool} from '../../common/models/SystemPool';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {BusService} from '../bus.service';
import {SasiColumn, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {RouteLinkFormatterComponent} from '../route-link-formatter/route-link-formatter.component';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';
import {AlertFormatterComponent} from '../alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SimpleFormatterComponent} from '../simple-formatter/simple-formatter.component';


@Component({
  selector: 'app-dp-sla',
  templateUrl: './dp-sla-2.component.html',
  styleUrls: ['./dp-sla.component.css', '../global-statistics.component.css'],
  animations: [ // TODO reuse animation in all collapsed sasi-table group
    trigger('slideInOut', [
      state('true', style({height: '0px', overflow: 'hidden', margin: '0'})),
      state('false', style({'height': '*', overflow: 'hidden', margin: '0'})),
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

    this.options.columns.push(new SasiColumn('name', 'System', RouteLinkFormatterComponent, false));
    this.options.columns.push(new SasiColumn(SystemMetricType.SLA_EVENTS, 'SLA Events', SimpleFormatterComponent, false));
    this.options.columns.push(new SasiColumn(SystemMetricType.OUT_OF_SLA_TIME, 'Out of SLA Time', SimpleFormatterComponent, false)); // TODO use time formatter
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.labelColumnWidth = '25';
    this.options.valueColumnWidth = '35.75';
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

  // getData(): SystemPool[] {
  //   return <SystemPool[]>this.data;
  // }
  //
  // recalculateSorting(data: SystemPool[], sortType, sortColumn): SystemPool[] {
  //   let dataReturned = [];
  //   if (sortColumn === null) {
  //     dataReturned = data.map(system => {
  //       if (sortType === SortType.ASC) {
  //         system.pools = system.pools.sort((poolA, poolB) => this.compare(poolA.name, poolB.name));
  //       } else {
  //         system.pools = system.pools.sort((poolA, poolB) => this.compare(poolB.name, poolA.name));
  //       }
  //       return system;
  //     });
  //     dataReturned = dataReturned.sort(
  //       (systemA, systemB) => {
  //         if (sortType === SortType.ASC) {
  //           return this.compare(systemA.name, systemB.name);
  //         } else {
  //           return this.compare(systemB.name, systemA.name);
  //         }
  //       }
  //     );
  //   } else {
  //     dataReturned = data.map(system => {
  //       system.pools = system.pools.sort(
  //         (poolA, poolB) => {
  //           if (sortType === SortType.ASC) {
  //             return this.compare(this.findMetric(poolA, sortColumn).value, this.findMetric(poolB, sortColumn).value);
  //           } else {
  //             return this.compare(this.findMetric(poolB, sortColumn).value, this.findMetric(poolA, sortColumn).value);
  //           }
  //         }
  //       );
  //       return system;
  //     });
  //   }
  //   return dataReturned;
  // }
  //
  // compare(valueA, valueB) {
  //   if (valueA > valueB) {
  //     return 1;
  //   } else if (valueA < valueB) {
  //     return -1;
  //   }
  //   return 0;
  // }
  //
  // findMetric(pool: SystemDetail, metricType: SystemMetricType) {
  //   return pool.metrics.find(metric => metric.type === metricType);
  // }
  //
  // setData(data: SystemPool[]) {
  //   this.data = data;
  // }

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
