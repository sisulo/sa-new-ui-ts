import {Region} from './region.enum';
import {Metric} from '../metrics/metric.vo';

export class RegionMetricDto {
  region: Region;
  metrics: Metric[] = [];
}
