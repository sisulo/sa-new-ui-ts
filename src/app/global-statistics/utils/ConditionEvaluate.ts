export class ConditionEvaluate {

  static eval(value, rule) {
    return value > rule.threshold;
  }

}
