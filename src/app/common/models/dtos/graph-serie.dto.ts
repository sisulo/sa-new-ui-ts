import {SystemMetricType} from '../metrics/SystemMetricType';

export class GraphSerie {
  type: SystemMetricType;
  data: [{ x, y }];
}
