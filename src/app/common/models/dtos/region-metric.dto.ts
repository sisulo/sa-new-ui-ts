import {Region} from './region.enum';
import {Metric} from '../metrics/Metric';

export class RegionMetricDto {
  region: Region;
  metrics: Metric[] = [];
}
