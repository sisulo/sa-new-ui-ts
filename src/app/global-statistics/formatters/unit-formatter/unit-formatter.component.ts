import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiTableOptions} from '../../../common/components/sasi-table/sasi-table.component';
import {ConditionEvaluateUtils} from '../../utils/condition-evaluate.utils';
import {AlertRule} from '../../alert-rule';

@Component({
  selector: 'app-unit-formatter',
  templateUrl: './unit-formatter.component.html',
  styleUrls: ['./unit-formatter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitFormatterComponent implements OnInit {

  private static ONE_DAY_IN_MS = 86400000;

  @Input() label = '';
  @Input() public data: SystemMetric;
  @Input() public options: SasiTableOptions;

  @Input() public column: SasiColumn;

  todayDate = true;
  daysFromToday = '0';

  constructor() {
  }

  ngOnInit() {
    if (this.data !== null && this.data.date !== undefined && this.data.date !== null) {
      const today = new Date();
      const metricDate = new Date(this.data.date);
      this.daysFromToday = ((today.getTime() - metricDate.getTime()) / UnitFormatterComponent.ONE_DAY_IN_MS).toFixed(0);
      this.todayDate = parseInt(this.daysFromToday, 10) <= 2;
    }
  }

  isAlert(): boolean {
    const ruleDefinitions = this.findRulesByType(this.data.type);
    if (ruleDefinitions.length > 0) {
      return ruleDefinitions.find(
        ruleDefinition => ConditionEvaluateUtils.eval(this.data.value, ruleDefinition)
      ) !== undefined;
    }
    return false;
  }

  getAlertMessage(): string {
    const ruleDefinition = this.getViolatedRule();
    const oldDataMessage = (!this.isTodayDate()) ? `(${this.daysFromToday} days old data)` : '';
    return this.label + ' is over ' + ruleDefinition.threshold.min + this.data.unit + ' ' + oldDataMessage;
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
        ruleDefinition => ConditionEvaluateUtils.eval(this.data.value, ruleDefinition)
      );
    }
  }

  getViolatedRuleClass(): string {
    const ruleDefinition = this.getViolatedRule();
    if (ruleDefinition !== undefined && ConditionEvaluateUtils.eval(this.data.value, ruleDefinition)) {
      return ruleDefinition.threshold.alertType;
    }
    return '';
  }

  getValue() {
    return this.data.value % 1 === 0 ? this.data.value : this.data.value.toFixed(1);
  }

  isTodayDate() {
    return this.todayDate;
  }

  getTooltipMessage(): string {
    if (!this.isTodayDate()) {
      return `${this.daysFromToday} days old data`;
    }
    if (this.column !== undefined) {
      return this.column.tooltipText;
    }
  }

}
