import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';
import {SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {ConditionEvaluate} from '../../utils/ConditionEvaluate';
import {AlertRule} from '../../alert-rule';

@Component({
  selector: 'app-unit-formatter',
  templateUrl: './unit-formatter.component.html',
  styleUrls: ['./unit-formatter.component.css']
})
export class UnitFormatterComponent implements OnInit {

  @Input() label = '';
  @Input() public data: SystemMetric;
  @Input() public options: SasiTableOptions;

  constructor() {
  }

  ngOnInit() {
  }

  isAlert(): boolean {
    const ruleDefinitions = this.findRulesByType(this.data.type);
    if (ruleDefinitions.length > 0) {
      return ruleDefinitions.find(
        ruleDefinition => ConditionEvaluate.eval(this.data.value, ruleDefinition)
      ) !== undefined;
    }
    return false;
  }

  getAlertMessage(): string {
    const ruleDefinition = this.getViolatedRule();
    return this.label + ' is over ' + ruleDefinition.threshold.min + this.data.unit + ' ';
  }

  findRulesByType(type: string): AlertRule[] {
    return this.options.cellDecoratorRules.filter(
      rule => rule.type === type
    );
  }

  getViolatedRule(): AlertRule {
    const ruleDefinitions = this.findRulesByType(this.data.type);
    if (ruleDefinitions.length > 0) {
      return ruleDefinitions.find(
        ruleDefinition => ConditionEvaluate.eval(this.data.value, ruleDefinition)
      );
    }
  }

  getViolatedRuleClass(): string {
    const ruleDefinition = this.getViolatedRule();
    if (ruleDefinition !== undefined && ConditionEvaluate.eval(this.data.value, ruleDefinition)) {
      return ruleDefinition.threshold.alertType;
    }
    return '';
  }

  getValue() {
    return this.data.value % 1 === 0 ? this.data.value : this.data.value.toFixed(1);
  }
}
