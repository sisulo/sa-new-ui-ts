import {Component, OnInit} from '@angular/core';
import {Metric} from '../../../common/models/metrics/Metric';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {MetricService} from '../../../metric.service';

@Component({
  selector: 'app-global-logical-statistics',
  templateUrl: './global-logical-statistics.component.html',
  styleUrls: ['./global-logical-statistics.component.css']
})
export class GlobalLogicalStatisticsComponent implements OnInit {

  data: Metric[] = [];
  types = [];
  groupTypes = [0, 1, 2, 3, 4, 5];
  labels: string[] = [];
  groupLabel = [];

  constructor(protected metricService: MetricService) {
    this.types[0] = [
      SystemMetricType.PHYSICAL_SUBS_PERC,
      SystemMetricType.LOGICAL_SUBS_PERC,
      SystemMetricType.NET_SUBS_PERC
    ];
    this.types[1] = [
      SystemMetricType.PHYSICAL_USED_PERC,
      SystemMetricType.LOGICAL_USED_PERC,
      SystemMetricType.NET_USED_PERC
    ];
    this.types[2] = [
      SystemMetricType.PHYSICAL_CAPACITY,
      SystemMetricType.PHYSICAL_USED,
      SystemMetricType.PHYSICAL_FREE,
    ];
    this.types[3] = [
      SystemMetricType.LOGICAL_CAPACITY,
      SystemMetricType.LOGICAL_USED,
      SystemMetricType.LOGICAL_FREE
    ];
    this.types[4] = [
      SystemMetricType.NET_TOTAL,
      SystemMetricType.NET_USED,
      SystemMetricType.NET_FREE
    ];
    this.types[5] = [
      SystemMetricType.COMPRESS_RATIO,
      SystemMetricType.DEDUP_RATIO,
      SystemMetricType.TOTAL_SAVING_EFFECT
    ];

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

    this.groupLabel[0] = 'Subscription';
    this.groupLabel[1] = 'Utilization';
    this.groupLabel[2] = 'Physical Capacity';
    this.groupLabel[3] = 'Logical Capacity';
    this.groupLabel[4] = 'Net Capacity';
    this.groupLabel[5] = 'Savings';
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData(): any[] { // TODO duplicated for all GS sasi tables
    this.metricService.getGobalCapacityStatistics().subscribe(
      data => {
        this.data = data.metrics;
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }

  getMetricByType(type: SystemMetricType): Metric {
    return this.data.find(metric => metric.type === type);
  }

  getLabelByType(type: string): string {
    return this.labels[type] != null ? this.labels[type] : null;
  }

  toFixed(value, position) {
    if (value == null) {
      return 'No value';
    }
    return parseFloat(value).toFixed(position);
  }

  getGroupLabelByType(type: number): string {
    return this.groupLabel[type] != null ? this.groupLabel[type] : null;
  }
}
