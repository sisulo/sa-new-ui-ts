import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';

export class DivTable {
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
    console.log('Current column:' + column);
    this.currentColumn = column;
  }

  getMetric(metrics: SystemMetric[], metricName: SystemMetricType): SystemMetric {
    return metrics.find(metric => metric.type === metricName);
  }
}
