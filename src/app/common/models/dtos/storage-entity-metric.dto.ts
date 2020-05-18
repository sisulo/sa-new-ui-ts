import {SystemMetric} from '../metrics/system-metric.vo';


export class StorageEntityMetricDto {
  id: number;
  name: string;
  type: string;
  status: string;
  serialNumber: string;
  children: StorageEntityMetricDto[];
  metrics: SystemMetric[];
  externals: [];
}
