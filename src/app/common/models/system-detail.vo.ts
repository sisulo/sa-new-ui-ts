import {SystemMetric} from './metrics/system-metric.vo';
import {System} from './system.vo';
import {ComponentExternal} from './component-external.vo';

export class SystemDetail extends System {
  id: number;
  name: string;
  metrics: SystemMetric[] = [];
  ports: SystemDetail[] = [];
  externals: ComponentExternal[];
}
