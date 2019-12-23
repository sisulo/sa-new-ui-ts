import {Occurence} from './occurence.vo';
import {AlertType} from './alert-type.enum';

export class Alert {
  type: AlertType;
  minValue: number;
  maxValue: number;
  unit: string;
  occurrences: Occurence[];
}
