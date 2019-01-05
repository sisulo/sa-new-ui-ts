import {SystemMetric} from './metrics/SystemMetric';
import {System} from './System';

export class SystemDetail extends System {
  metrics: SystemMetric[];
}
