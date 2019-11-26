import {SystemMetric} from './metrics/SystemMetric';
import {System} from './System';

export class SystemDetail extends System {
  id: number;
  name: string;
  metrics: SystemMetric[] = [];
  ports: SystemDetail[] = [];
}
