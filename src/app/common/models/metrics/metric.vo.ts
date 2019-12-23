import {SystemMetricType} from './system-metric-type.enum';

export class Metric {
  value: number;
  unit: string;
  type: SystemMetricType;
}
