import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';
import {SasiColumn} from '../../../common/components/sasi-table/sasi-table.component';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';

@Component({
  selector: 'app-time-interval-formatter',
  templateUrl: './time-interval-formatter.component.html',
  styleUrls: ['./time-interval-formatter.component.css']
})
export class TimeIntervalFormatterComponent extends UnitFormatterComponent implements OnInit {

  @Input() public data: SystemMetric;
  @Input() public label;
  @Input() public column: SasiColumn;

  constructor() {
    super();
  }

  getValue() {
    return this.getTime(new Date(this.data.startTime)) + ' - ' + this.getTime(new Date(this.data.endTime));
  }

  getTime(date: Date): string {
    return [
      this.getPaddedValue(date.getUTCHours()),
      this.getPaddedValue(date.getMinutes()),
      this.getPaddedValue(date.getSeconds())
    ].join(':');
  }

  getPaddedValue(number: number) {
    return number.toFixed(0).padStart(2, '0');
  }
}
