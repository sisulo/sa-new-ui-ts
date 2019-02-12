import {Metric} from './Metric';
import {Alert} from './Alert';

export class InfrastructureDto  {
  alerts: Alert[];
  metrics: Metric[];
}
