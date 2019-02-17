import {Component, Input, OnInit} from '@angular/core';
import {SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {ConditionEvaluate} from '../utils/ConditionEvaluate';

@Component({
  selector: 'app-alert-formatter',
  templateUrl: './alert-formatter.component.html',
  styleUrls: ['./alert-formatter.component.css']
})
export class AlertFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;
  @Input() public options: SasiTableOptions;

  constructor() { }

  ngOnInit() {
  }

  isAlert() {
    return this.options.cellDecoratorRules.find(
      rule => {
        const cell = this.data[rule.type];
        return ConditionEvaluate.eval(cell.value, rule);
      }
    ) !== undefined;
  }
}
