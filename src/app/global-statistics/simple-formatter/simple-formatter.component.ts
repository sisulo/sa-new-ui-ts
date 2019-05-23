import {Component, Input, OnInit} from '@angular/core';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';
import {SasiColumn} from '../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-simple-formatter',
  templateUrl: './simple-formatter.component.html',
  styleUrls: ['./simple-formatter.component.css']
})
export class SimpleFormatterComponent extends UnitFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;
  @Input() public column: SasiColumn;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  getTooltipMessage(): string {
    if (this.column !== undefined) {
      return this.column.tooltipText;
    }
  }
}
