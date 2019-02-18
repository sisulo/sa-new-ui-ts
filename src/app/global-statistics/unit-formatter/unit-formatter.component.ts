import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {ConditionEvaluate} from '../utils/ConditionEvaluate';
import {AlertRule} from '../AlertRule';

@Component({
  selector: 'app-unit-formatter',
  templateUrl: './unit-formatter.component.html',
  styleUrls: ['./unit-formatter.component.css']
})
export class UnitFormatterComponent implements OnInit {

  @Input() label = '';
  @Input() public data: SystemMetric;
  @Input() public options: SasiTableOptions;

  constructor() { }

  ngOnInit() {
  }

  isAlert(): boolean {
    const ruleDefinition = this.findRuleByType(this.data.type);
    if (ruleDefinition !== undefined) {
      return ConditionEvaluate.eval(this.data.value, ruleDefinition);
    }
    return false;
  }

  getAlertMessage(): string {
    const ruleDefinition = this.findRuleByType(this.data.type);
    return this.label + ' is over ' + ruleDefinition.threshold + this.data.unit + ' ';
  }

  findRuleByType(type: string): AlertRule {
    return this.options.cellDecoratorRules.find(
      rule => rule.type === type
    );
  }
  getViolatedRuleClass(): string {
    const ruleDefinition = this.findRuleByType(this.data.type);
    if (ruleDefinition !== undefined && ConditionEvaluate.eval(this.data.value, ruleDefinition)) {
      return ruleDefinition.threshold.alertType;
    }
    return '';
  }
}
