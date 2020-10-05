import {Metric} from './metric.vo';

export class SystemMetric extends Metric {
  date: Date;
  startTime: number;
  endTime: number;
  peak: number;
}
