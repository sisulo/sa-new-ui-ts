import {Component, Input, OnInit} from '@angular/core';
import {SasiColumn, SasiGroupRow} from '../../../common/components/sasi-table/sasi-table.component';
import {LocalStorageService} from 'ngx-store';
import {SasiWeightedArithmeticMean} from '../../utils/SasiWeightedArithmeticMean';
import {AggregatedValues} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {Metric} from '../../../common/models/metrics/Metric';

@Component({
  selector: 'app-grouped-aggregated-statistics',
  templateUrl: './grouped-aggregated-statistics.component.html',
  styleUrls: ['./grouped-aggragated-statistics.component.css']
})
export class GroupedAggregatedStatisticsComponent implements OnInit {

  @Input() data: SasiGroupRow[];
  @Input() aggregatedTypes: SasiColumn[];
  @Input() prefix: string;
  @Input() selectedRows: Array<SelectedRow>;
  result: AggregatedValues;
  types = [];
  groupTypes = [0, 1, 2, 3, 4, 5];
  labels: string[] = [];
  groupLabel = [];
  subsCapacityType: SystemMetricType = SystemMetricType.SUBSCRIBED_CAPACITY;


  constructor(private localStorageService: LocalStorageService) {
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

  getSelectedCount() {
    const filteredByData = this.selectedRows.filter(
      key => {
        const row = this.data.find(groupRow => groupRow.groupRow.getCell('name').value === key.groupName);
        if (row === undefined) {
          return false;
        }

        return row.rows.find(
          dataRow => dataRow.getCell('name').value === key.rowName
        );
      }
    );
    return filteredByData.length;
  }

  getMetricByType(type: SystemMetricType): Metric {
    return this.result.getValue(type);
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
