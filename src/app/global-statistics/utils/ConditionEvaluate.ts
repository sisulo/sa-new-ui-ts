import {AlertRule} from '../alert-rule';

export class ConditionEvaluate {

  static eval(value, rule: AlertRule) {
    if (rule.threshold.max != null) {
      return value >= rule.threshold.min && value < rule.threshold.max;
    }
    return value > rule.threshold.min;
  }

}
