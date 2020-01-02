import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';
import {SasiColumn} from '../../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-simple-formatter',
  templateUrl: './simple-formatter.component.html',
  styleUrls: ['./simple-formatter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  getValue() {
    if (this.column.isInfinity === true && this.data.value === -1) {
      return '<i class="fas fa-infinity" style="font-size: 12px"></i> ';
    }
    return this.data.value % 1 === 0 ? this.data.value : this.data.value.toFixed(1);
  }
}
