import {Metric} from '../metrics/Metric';
import {Alert} from '../metrics/Alert';

export class InfrastructureDto  {
  alerts: Alert[];
  metrics: Metric[];
}
