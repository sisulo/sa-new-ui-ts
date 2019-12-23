import {SystemMetricType} from '../common/models/metrics/system-metric-type.enum';

export class AlertRule {
  type: SystemMetricType;
  threshold: Threshold;

  constructor(type: SystemMetricType, threshold: Threshold) {
    this.threshold = threshold;
    this.type = type;
  }
}

export class Threshold {
  alertType: string;
  min: number;
  max: number;

  constructor(alertType: string, min: number, max: number) {
    this.alertType = alertType;
    this.min = min;
    this.max = max;
  }
}
