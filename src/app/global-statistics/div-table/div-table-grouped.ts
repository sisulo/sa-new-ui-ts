import {DivTable} from './div-table';
import {ActivatedRoute, Router} from '@angular/router';
import {PeriodService} from '../../period.service';
import {MetricService} from '../../metric.service';
import {BusService} from '../bus.service';
import {LocalStorage} from 'ngx-store';
import {ItemKey} from '../capacity-statistics/capacity-statistics.component';
import {SystemDetail} from '../../common/models/SystemDetail';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';

class SelectedItems {
  [key: string]: Array<ItemKey>;
}

class CollapsedItems {
  [key: string]: Array<string>;
}

export abstract class DivTableGrouped extends DivTable {

  data: any[] = [];
  predictions: SystemMetricType[] = [
    SystemMetricType.PREDICTION_L1,
    SystemMetricType.PREDICTION_L2,
    SystemMetricType.PREDICTION_L3
  ];

  @LocalStorage() selectedPools: SelectedItems = {};
  @LocalStorage() collapsedRows: CollapsedItems = {};

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService,
    protected bus: BusService
  ) {
    super();
  }
  internalInit(id: number): void {
    this.currentDataCenterId = id;
    this.getTableData(id);
    if (!this.selectedPools.hasOwnProperty(this.currentDataCenterId)) {
      this.selectedPools[this.currentDataCenterId] = [];
    }
    if (!this.collapsedRows.hasOwnProperty(this.currentDataCenterId)) {
      this.collapsedRows[this.currentDataCenterId] = [];
    }
  }

  // getSystemStatistics(systemName: string): SystemAggregatedStatistics {
  //   return this.aggregatedStats.find(stats => stats.system === systemName);
  // }

  addCollapsed(systemName: string) {
    if (!this.collapsedRows.hasOwnProperty(this.currentDataCenterId)) {
      this.collapsedRows[this.currentDataCenterId] = [];
    }
    const index = this.collapsedRows[this.currentDataCenterId].findIndex(name => name === systemName);
    if (index > -1) {
      this.collapsedRows[this.currentDataCenterId].splice(index, 1);
    } else {
      this.collapsedRows[this.currentDataCenterId].push(systemName);
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapsed(systemName: string): boolean {
    return this.collapsedRows[this.currentDataCenterId].findIndex(value => value === systemName) > -1;
  }

  collapseAll() {
    if (this.isCollapseAll()) {
      this.collapsedRows[this.currentDataCenterId] = [];
    } else {
      this.collapsedRows[this.currentDataCenterId] = this.getData().map(value => value.name);
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapseAll(): boolean {

    return this.collapsedRows[this.currentDataCenterId].length === this.getData().length;
  }

  // getOccuredAlert(systemPool, type){
  //   return false;
  // }
  getAlertMessage(systemPool: SystemDetail, type: SystemMetricType) {

    // const alertDefinition = this.getOccuredAlert(systemPool, type);
    //
    // if (alertDefinition !== undefined) {
    //   return this.getColumnLabel(type) + ' is over ' + alertDefinition.threshold.min + ' for ' + systemPool.name;
    // }
    return '';

  }

  getMetricTooltip(systemPool: SystemDetail, type: SystemMetricType) {
    const tooltip = this.getAlertMessage(systemPool, type);
    if (this.predictions.includes(type)) {
      return 'Prediction of "Physical usage" metric threshold reached in days';
    }
    if (tooltip === '') {
      return this.getColumnLabel(type);
    }
    return tooltip;
  }


  abstract getTableData(id: number): any[];
}
