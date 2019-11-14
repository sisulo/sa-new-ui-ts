import {Metric} from '../metrics/Metric';
import {Alert} from '../metrics/Alert';
import {RegionMetricDto} from './region-metric.dto';

export class InfrastructureDto {
  alerts: Alert[];
  metrics: Metric[];
  capacityMetrics: RegionMetricDto[];
}
