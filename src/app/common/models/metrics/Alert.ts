import {Occurence} from './Occurence';
import {SystemMetricType} from './SystemMetricType';

export class Alert {
  type: SystemMetricType;
  occurrences: Occurence[];
}
