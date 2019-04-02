import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SasiRow, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {ConditionEvaluate} from '../utils/ConditionEvaluate';

@Component({
  selector: 'app-alert-formatter',
  templateUrl: './alert-formatter.component.html',
  styleUrls: ['./alert-formatter.component.css']
})
export class AlertFormatterComponent implements OnInit {

  @Input() public data: SasiRow;
  @Input() public label;
  @Input() public options: SasiTableOptions;
  constructor() {
  }

  ngOnInit() {
  }

  isAlert() {
    return this.options.cellDecoratorRules.find(
      rule => {
        const cell = this.data.getCell(rule.type);
        return ConditionEvaluate.eval(cell.value, rule);
      }
    ) !== undefined;
  }
  getDecoratorClass() {
    const alertDef = this.options.cellDecoratorRules.find(
      rule => {
        const cell = this.data.getCell(rule.type);
        return ConditionEvaluate.eval(cell.value, rule);
      }
    );
    if (alertDef !== null) {
      return alertDef.threshold.alertType;
    }
    return '';
  }
}
