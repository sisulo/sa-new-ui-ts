import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../../metric.service';
import {Metric} from '../../../common/models/metrics/Metric';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {SystemPool2SasiGroupTablePipe} from '../../../common/utils/system-pool-2-sasi-group-table.pipe';
import {SasiWeightedArithmeticMean} from '../../utils/SasiWeightedArithmeticMean';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {AggregatedValues} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';

export class CommonAggregatedStats {
  result: AggregatedValues;
  aggregatedTypes: SystemMetricType[] = [];
  labels: string[] = [];
  typesIntValue: SystemMetricType[] = [];

  getMetricByType(type: SystemMetricType): Metric {
    if (this.result.getValue(type) !== undefined) {
      return this.result.getValue(type);
    }
    return null;
  }

  getLabelByType(type: string): string {
    return this.labels[type] != null ? this.labels[type] : null;
  }

  toFixed(type, value, position) {
    if (value == null) {
      return 'No value';
    }

    if (this.typesIntValue.some(item => item === type)) {
      return parseFloat(value).toFixed(0);
    }

    return parseFloat(value).toFixed(position);
  }
}

@Component({
  selector: 'app-infrastructure-statistics',
  templateUrl: './aggragated-statistics.component.html',
  styleUrls: ['./aggragated-statistics.component.css']
})
export class GlobalPhysicalCapacityStatisticsComponent extends CommonAggregatedStats implements OnInit {

  constructor(protected metricService: MetricService,
              protected transformer: SystemPool2SasiGroupTablePipe) {
    super();
    this.aggregatedTypes = [
      SystemMetricType.PHYSICAL_CAPACITY,
      SystemMetricType.PHYSICAL_SUBS_PERC,
      SystemMetricType.AVAILABLE_CAPACITY,
      SystemMetricType.LOGICAL_USED_PERC,
      SystemMetricType.PHYSICAL_USED_PERC,
      SystemMetricType.COMPRESS_RATIO,
      SystemMetricType.CAPACITY_CHANGE_1D,
      SystemMetricType.CAPACITY_CHANGE_1W,
      SystemMetricType.CAPACITY_CHANGE_1M,
    ];

    this.typesIntValue = [
      SystemMetricType.AVAILABLE_CAPACITY,
      SystemMetricType.PHYSICAL_CAPACITY
    ];

    this.labels[SystemMetricType.PHYSICAL_CAPACITY] = 'Physical Capacity';
    this.labels[SystemMetricType.PHYSICAL_SUBS_PERC] = 'Physical Subs';
    this.labels[SystemMetricType.AVAILABLE_CAPACITY] = 'Available Capacity';
    this.labels[SystemMetricType.LOGICAL_USED_PERC] = 'Logical Used';
    this.labels[SystemMetricType.PHYSICAL_USED_PERC] = 'Physical Used';
    this.labels[SystemMetricType.COMPRESS_RATIO] = 'Comp. Ratio';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1D] = 'Daily Change';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1W] = 'Weekly Change';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1M] = 'Monthly Change';
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData(): AggregatedValues { // TODO duplicated for all GS sasi tables
    this.metricService.getGlobalCapacityStatistics().subscribe(
      data => {
        const average = new SasiWeightedArithmeticMean();
        const filter: SelectedRow[] = [];
        data.systems.forEach(
          system => system.pools.forEach(
            pool => {
              const row = new SelectedRow(system.name, pool.name);
              filter.push(row);
            }));
        this.result = average.computeSummaries(this.transformer.transform(data.systems), filter);
      },
      error => {
        console.log(error);
        this.result = null;
      }
    );
    return this.result;
  }

}
