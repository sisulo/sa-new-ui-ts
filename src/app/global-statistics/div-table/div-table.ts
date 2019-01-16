import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';

export enum SortType {
  ASC = 0,
  DESC = 1
}

export abstract class DivTable {
  sortType = SortType.ASC;
  sortColumn: SystemMetricType;

  types: SystemMetricType[] = [];
  labelMetrics: {} = {};
  private currentColumn = -1;

  isCurrentColumn(column: number) {
    return column === this.currentColumn;
  }

  getColumnLabel(type: SystemMetricType) {
    return this.labelMetrics[type];
  }

  setCurrentColumn(column: number) {
    this.currentColumn = column;
  }

  getMetric(metrics: SystemMetric[], metricName: SystemMetricType): SystemMetric {
    return metrics.find(metric => metric.type === metricName);
  }

  setSort(column) {
    if (this.sortColumn === column) {
      if (this.sortType === SortType.ASC) {
        this.sortType = SortType.DESC;
      } else {
        this.sortType = SortType.ASC;
      }
    } else {
      this.sortType = SortType.ASC;
      this.sortColumn = column;
    }
    this.setData(this.recalculateSorting(this.getData(), this.sortType, this.sortColumn));
  }

  getSortIconClass(column: SystemMetricType) {
    if (this.sortColumn === column) {
      if (this.sortType === SortType.ASC) {
        return 'fa-sort-amount-asc';
      } else {
        return 'fa-sort-amount-desc';
      }
    }
    return 'fa-sort';
  }

  abstract setData(data);

  abstract getData();

  abstract recalculateSorting(data, sortType, sortColumn);

}
