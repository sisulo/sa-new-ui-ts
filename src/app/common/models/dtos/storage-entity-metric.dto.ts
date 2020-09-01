import {SystemMetric} from '../metrics/system-metric.vo';
import {StorageEntityDetailResponseDto} from './storage-entity-detail-response.dto';


export class StorageEntityMetricDto {
  id: number;
  name: string;
  type: string;
  status: string;
  serialNumber: string;
  children: StorageEntityMetricDto[];
  metrics: SystemMetric[];
  externals: [];
  detail: StorageEntityDetailResponseDto;
}
