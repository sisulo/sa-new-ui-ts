import {Component, OnInit} from '@angular/core';
import {AggregatedValues} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {MetricService} from '../../../metric.service';
import {SystemPool2SasiGroupTablePipe} from '../../../common/utils/system-pool-2-sasi-group-table.pipe';
import {SasiWeightedArithmeticMean} from '../../utils/SasiWeightedArithmeticMean';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {Metric} from '../../../common/models/metrics/Metric';

@Component({
  selector: 'app-global-host-group-capacity',
  templateUrl: './global-host-group-capacity.component.html',
  styleUrls: ['./global-host-group-capacity.component.css']
})
export class GlobalHostGroupCapacityComponent implements OnInit {

  data: AggregatedValues;
  types: SystemMetricType[];
  labels: string[] = [];

  constructor(protected metricService: MetricService,
              protected transformer: SystemPool2SasiGroupTablePipe) {
    this.types = [
      SystemMetricType.NET_TOTAL,
      SystemMetricType.NET_USED,
      SystemMetricType.NET_USED_PERC,
      SystemMetricType.CAPACITY_CHANGE_1D,
      SystemMetricType.CAPACITY_CHANGE_1W,
      SystemMetricType.CAPACITY_CHANGE_1M
    ];

    this.labels[SystemMetricType.NET_TOTAL] = 'Provisioned Capacity';
    this.labels[SystemMetricType.NET_USED] = 'Used Capacity';
    this.labels[SystemMetricType.NET_USED_PERC] = 'Used Capacity';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1D] = 'Last Day Change';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1W] = 'Last Week Change';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1M] = 'Last Month Change';
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData(): AggregatedValues { // TODO duplicated for all GS sasi tables
    this.metricService.getGlobalHostGroupCapacityStatistics().subscribe(
      data => {
        const average = new SasiWeightedArithmeticMean();
        const filter: SelectedRow[] = [];
        data.systems.forEach(

          system => system.pools.forEach(
            pool => {
              const row = new SelectedRow(system.name, pool.name);
              filter.push(row);
            }));
        this.data = average.computeSummaries(this.transformer.transform(data.systems), filter);
      },
      error => {
        console.log(error);
        this.data = null;
      }
    );
    return this.data;
  }

  getMetricByType(type: SystemMetricType): Metric {
    return this.data.getValue(type);
  }

  getLabelByType(type: string): string {
    return this.labels[type] != null ? this.labels[type] : null;
  }

  toFixed(value, position) {
    return parseFloat(value).toFixed(position);
  }

}
