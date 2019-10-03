import {Occurence} from './Occurence';
import {AlertType} from './AlertType';

export class Alert {
  type: AlertType;
  minValue: number;
  maxValue: number;
  unit: string;
  occurrences: Occurence[];
}
