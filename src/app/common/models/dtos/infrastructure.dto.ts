import {Alert} from '../metrics/alert.vo';
import {RegionMetricDto} from './region-metric.dto';

export class InfrastructureDto {
  alerts: Alert[];
  metrics: RegionMetricDto[];
}
