import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {ConditionEvaluate} from '../utils/ConditionEvaluate';

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

  // TODO extract to abstract class and then extends simple-unit
  getValue(name: string) {
    if (this.data !== null) {
      return this.data[name] === undefined ? this.data : this.data[name];
    }
    return '';
  }

  isAlert(): boolean {
    const ruleDefinition = this.options.cellDecoratorRules.find(
      rule => rule.type === this.data.type
    ); // TODO refactor - extract find rule definition to method
    if (ruleDefinition !== undefined) {
      return ConditionEvaluate.eval(this.data.value, ruleDefinition);
    }
    return false;
  }

  getAlertMessage(): string {
    const ruleDefinition = this.options.cellDecoratorRules.find(
      rule => rule.type === this.data.type
    );
    return this.label + ' is over ' + ruleDefinition.threshold + this.data.unit + ' ';
  }
}
