import {SystemMetric} from './metrics/SystemMetric';
import {System} from './System';
import {ComponentExternal} from './ComponentExternal';

export class SystemDetail extends System {
  id: number;
  name: string;
  metrics: SystemMetric[] = [];
  ports: SystemDetail[] = [];
  externals: ComponentExternal[];
}
