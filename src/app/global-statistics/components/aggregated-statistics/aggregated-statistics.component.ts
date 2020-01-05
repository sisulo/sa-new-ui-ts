import {Component, Input, OnInit} from '@angular/core';
import {SasiColumn, SasiGroupRow} from '../../../common/components/sasi-table/sasi-table.component';
import {LocalStorageService} from 'ngx-store';
import {SasiWeightedArithmeticMeanUtils} from '../../utils/sasi-weighted-arithmetic-mean.utils';
import {AggregatedValues} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {CommonAggregatedStats} from './global-physical-capacity-statistics.component';
import {SystemMetricType} from '../../../common/models/metrics/system-metric-type.enum';

@Component({
  selector: 'app-aggregated-statistics',
  templateUrl: './aggregated-statistics.component.html',
  styleUrls: ['./aggregated-statistics.component.css']
})
export class AggregatedStatisticsComponent extends CommonAggregatedStats implements OnInit {

  @Input() data: SasiGroupRow[];
  @Input() aggregatedColumns: SasiColumn[];
  @Input() prefix: string;
  @Input() selectedRows: Array<SelectedRow>;
  result: AggregatedValues;

  constructor(private localStorageService: LocalStorageService) {
    super();

  }

  ngOnInit() {

    this.aggregatedTypes = [
      SystemMetricType.SELECTED_COUNT,
      ...this.aggregatedColumns.map(type => <SystemMetricType>type.index)
    ];

    this.labels[SystemMetricType.SELECTED_COUNT] = '# Selected';
    this.aggregatedColumns.forEach(type => this.labels[type.index] = type.label);
    this.typesIntValue = [
      SystemMetricType.SELECTED_COUNT,
      SystemMetricType.PHYSICAL_CAPACITY,
      SystemMetricType.PHYSICAL_SUBS_PERC,
      SystemMetricType.AVAILABLE_CAPACITY,
      SystemMetricType.LOGICAL_USED_PERC,
      SystemMetricType.PHYSICAL_USED_PERC,
      SystemMetricType.CAPACITY_CHANGE_1D,
      SystemMetricType.CAPACITY_CHANGE_1W,
      SystemMetricType.CAPACITY_CHANGE_1M];
    this.aggregate();
    this.localStorageService.observe(this.prefix + '_selected').subscribe(
      data => {
        this.selectedRows = data.newValue;
        this.aggregate();
      }
    );
  }

  aggregate() {
    this.selectedRows = this.localStorageService.get(this.prefix + '_selected');
    if (this.selectedRows === null) {
      this.selectedRows = [];
    }
    const mean = new SasiWeightedArithmeticMeanUtils();
    this.result = mean.computeSummaries(this.data, this.selectedRows);
  }
}
