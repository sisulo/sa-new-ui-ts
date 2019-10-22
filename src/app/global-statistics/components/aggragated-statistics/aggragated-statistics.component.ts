import {Component, Input, OnInit} from '@angular/core';
import {SasiColumn, SasiGroupRow} from '../../../common/components/sasi-table/sasi-table.component';
import {LocalStorageService} from 'ngx-store';
import {SasiWeightedArithmeticMean} from '../../utils/SasiWeightedArithmeticMean';
import {AggregatedValues} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {CommonAggregatedStats} from './global-physical-capacity-statistics.component';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';

@Component({
  selector: 'app-aggragated-statistics',
  templateUrl: './aggragated-statistics.component.html',
  styleUrls: ['./aggragated-statistics.component.css']
})
export class AggragatedStatisticsComponent extends CommonAggregatedStats implements OnInit {

  @Input() data: SasiGroupRow[];
  @Input('aggregatedTypes') types: SasiColumn[];
  @Input() prefix: string;
  @Input() selectedRows: Array<SelectedRow>;
  result: AggregatedValues;

  constructor(private localStorageService: LocalStorageService) {
    super();

  }

  ngOnInit() {

    this.aggregatedTypes = [
      SystemMetricType.SELECTED_COUNT,
      ...this.types.map(type => <SystemMetricType>type.index)
    ];

    this.labels[SystemMetricType.SELECTED_COUNT] = '# Selected';
    this.types.forEach(type => this.labels[type.index] = type.label);
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
    const mean = new SasiWeightedArithmeticMean();
    this.result = mean.computeSummaries(this.data, this.selectedRows);
  }
}
