import {SystemMetricType} from '../metrics/system-metric-type.enum';

export class GraphSerie {
  type: SystemMetricType;
  data: [{ x, y }];
}
