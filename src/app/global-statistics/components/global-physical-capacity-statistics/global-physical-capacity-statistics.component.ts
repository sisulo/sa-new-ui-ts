import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../../metric.service';
import {Metric} from '../../../common/models/metrics/Metric';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';

@Component({
  selector: 'app-infrastructure-statistics',
  templateUrl: './global-physical-capacity-statistics.component.html',
  styleUrls: ['./global-physical-capacity-statistics.component.css']
})
export class GlobalPhysicalCapacityStatisticsComponent implements OnInit {

  data: Metric[] = [];
  types: SystemMetricType[];
  labels: string[] = [];

  constructor(protected metricService: MetricService) {
    this.types = [
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
    return parseFloat(value).toFixed(position);
  }
}

