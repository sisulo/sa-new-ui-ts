import {Component, OnInit} from '@angular/core';
import {SystemMetricType} from '../../../common/models/metrics/system-metric-type.enum';
import {MetricService} from '../../../metric.service';
import {SasiWeightedArithmeticMeanUtils} from '../../utils/sasi-weighted-arithmetic-mean.utils';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {AggregatedValues} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SystemPool2SasiGroupTablePipe} from '../../../common/utils/system-pool-2-sasi-group-table.pipe';
import {CommonAggregatedStats} from '../aggregated-statistics/global-physical-capacity-statistics.component';

@Component({
  selector: 'app-global-logical-statistics',
  templateUrl: './grouped-aggregated-statistics.component.html',
  styleUrls: ['./grouped-aggragated-statistics.component.css']
})
export class GlobalLogicalStatisticsComponent extends CommonAggregatedStats implements OnInit {

  data: AggregatedValues = null;
  types = [];
  groupTypes = [0, 1, 2, 3, 4, 5, 6];
  groupLabel = [];

  constructor(protected metricService: MetricService,
              protected transformer: SystemPool2SasiGroupTablePipe) {
    super();
    this.typesIntValue = [
      SystemMetricType.PHYSICAL_USED,
      SystemMetricType.PHYSICAL_CAPACITY,
      SystemMetricType.PHYSICAL_FREE,
      SystemMetricType.NET_TOTAL,
      SystemMetricType.NET_USED,
      SystemMetricType.NET_FREE,
      SystemMetricType.LOGICAL_CAPACITY,
      SystemMetricType.LOGICAL_USED,
      SystemMetricType.LOGICAL_FREE,
      SystemMetricType.SUBSCRIBED_CAPACITY
    ];
    this.types.push([
      SystemMetricType.SUBSCRIBED_CAPACITY
    ]);
    this.types.push([
      SystemMetricType.PHYSICAL_SUBS_PERC,
      SystemMetricType.LOGICAL_SUBS_PERC,
      SystemMetricType.NET_SUBS_PERC
    ]);
    this.types.push([
      SystemMetricType.PHYSICAL_USED_PERC,
      SystemMetricType.LOGICAL_USED_PERC,
      SystemMetricType.NET_USED_PERC
    ]);
    this.types.push([
      SystemMetricType.PHYSICAL_CAPACITY,
      SystemMetricType.PHYSICAL_USED,
      SystemMetricType.PHYSICAL_FREE,
    ]);
    this.types.push([
      SystemMetricType.LOGICAL_CAPACITY,
      SystemMetricType.LOGICAL_USED,
      SystemMetricType.LOGICAL_FREE
    ]);
    this.types.push([
      SystemMetricType.NET_TOTAL,
      SystemMetricType.NET_USED,
      SystemMetricType.NET_FREE
    ]);
    this.types.push([
      SystemMetricType.COMPRESS_RATIO,
      SystemMetricType.DEDUP_RATIO,
      SystemMetricType.TOTAL_SAVING_EFFECT
    ]);

    this.labels[SystemMetricType.PHYSICAL_SUBS_PERC] = 'Physical';
    this.labels[SystemMetricType.LOGICAL_SUBS_PERC] = 'Logical';
    this.labels[SystemMetricType.NET_SUBS_PERC] = 'Net';
    this.labels[SystemMetricType.PHYSICAL_USED_PERC] = 'Physical';
    this.labels[SystemMetricType.LOGICAL_USED_PERC] = 'Logical';
    this.labels[SystemMetricType.NET_USED_PERC] = 'Net';
    this.labels[SystemMetricType.PHYSICAL_CAPACITY] = 'Capacity';
    this.labels[SystemMetricType.PHYSICAL_USED] = 'Used';
    this.labels[SystemMetricType.PHYSICAL_FREE] = 'Free';
    this.labels[SystemMetricType.LOGICAL_CAPACITY] = 'Capacity';
    this.labels[SystemMetricType.LOGICAL_USED] = 'Used';
    this.labels[SystemMetricType.LOGICAL_FREE] = 'Free';
    this.labels[SystemMetricType.NET_TOTAL] = 'Capacity';
    this.labels[SystemMetricType.NET_USED] = 'Used';
    this.labels[SystemMetricType.NET_FREE] = 'Free';
    this.labels[SystemMetricType.COMPRESS_RATIO] = 'Comp';
    this.labels[SystemMetricType.DEDUP_RATIO] = 'Dedup';
    this.labels[SystemMetricType.TOTAL_SAVING_EFFECT] = 'Savings';

    this.groupLabel.push('Subscribed');
    this.groupLabel.push('Subscription');
    this.groupLabel.push('Utilization');
    this.groupLabel.push('Physical Capacity');
    this.groupLabel.push('Logical Capacity');
    this.groupLabel.push('Net Capacity');
    this.groupLabel.push('Savings');
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData(): AggregatedValues { // TODO duplicated for all GS sasi tables
    this.metricService.getGlobalCapacityStatistics().subscribe(
      data => {
        const average = new SasiWeightedArithmeticMeanUtils();
        const filter: SelectedRow[] = [];
        data.systems.forEach(
          system => system.pools.forEach(
            pool => {
              const row = new SelectedRow(system.name, pool.name);
              filter.push(row);
            }));
        this.result = average.computeSummaries(this.transformer.transform(data.systems, ''), filter);
      },
      error => {
        console.log(error);
        this.data = null;
      }
    );
    return this.data;
  }

  getGroupLabelByType(type: number): string {
    return this.groupLabel[type] != null ? this.groupLabel[type] : null;
  }
}
