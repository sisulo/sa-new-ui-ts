import {Component, Input, OnInit} from '@angular/core';
import {SasiGroupRow} from '../../../common/components/sasi-table/sasi-table.component';
import {LocalStorageService} from 'ngx-store-9';
import {SasiWeightedArithmeticMeanUtils} from '../../utils/sasi-weighted-arithmetic-mean.utils';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {SystemMetricType} from '../../../common/models/metrics/system-metric-type.enum';
import {CommonAggregatedStats} from '../aggregated-statistics/global-physical-capacity-statistics.component';

@Component({
  selector: 'app-grouped-aggregated-statistics',
  templateUrl: './grouped-aggregated-statistics.component.html',
  styleUrls: ['./grouped-aggragated-statistics.component.css']
})
export class GroupedAggregatedStatisticsComponent extends CommonAggregatedStats implements OnInit {

  @Input() data: SasiGroupRow[];
  @Input() prefix: string;
  @Input() selectedRows: Array<SelectedRow>;
  typesIntValue: SystemMetricType[];
  types = [];
  groupTypes = [0, 1, 2, 3, 4, 5, 6, 7];
  groupLabel = [];


  constructor(private localStorageService: LocalStorageService) {
    super();
    this.typesIntValue = [
      SystemMetricType.SELECTED_COUNT,
      SystemMetricType.SUBSCRIBED_CAPACITY,
      SystemMetricType.PHYSICAL_SUBS_PERC,
      SystemMetricType.LOGICAL_SUBS_PERC,
      SystemMetricType.NET_SUBS_PERC,
      SystemMetricType.PHYSICAL_USED_PERC,
      SystemMetricType.LOGICAL_USED_PERC,
      SystemMetricType.NET_USED_PERC,
      SystemMetricType.PHYSICAL_CAPACITY,
      SystemMetricType.PHYSICAL_USED,
      SystemMetricType.PHYSICAL_FREE,
      SystemMetricType.LOGICAL_CAPACITY,
      SystemMetricType.LOGICAL_USED,
      SystemMetricType.LOGICAL_FREE,
      SystemMetricType.NET_TOTAL,
      SystemMetricType.NET_USED,
      SystemMetricType.NET_FREE,
    ];
    this.types.push([
      SystemMetricType.SELECTED_COUNT
    ]);
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

    this.groupLabel.push('# Selected');
    this.groupLabel.push('Subscribed');
    this.groupLabel.push('Subscription');
    this.groupLabel.push('Utilization');
    this.groupLabel.push('Physical Capacity');
    this.groupLabel.push('Logical Capacity');
    this.groupLabel.push('Net Capacity');
    this.groupLabel.push('Savings');
  }

  ngOnInit() {
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

  getGroupLabelByType(type: number): string {
    return this.groupLabel[type] != null ? this.groupLabel[type] : null;
  }
}
