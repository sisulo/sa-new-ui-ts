import {Component, Input, OnInit} from '@angular/core';
import {SasiColumn} from '../../../common/components/sasi-table/sasi-table.component';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';

@Component({
  selector: 'app-timestamp-to-date',
  templateUrl: './timestamp-to-date.component.html',
  styleUrls: ['./timestamp-to-date.component.css']
})
export class TimestampToDateComponent implements OnInit {

  @Input() public data: SystemMetric;
  @Input() public label;
  @Input() public column: SasiColumn;

  constructor() { }

  ngOnInit() {
  }

  getValue() {
    const startTime = new Date(this.data.startTime);
    return [startTime.getUTCDate(), startTime.getUTCMonth(), startTime.getUTCFullYear()].join('.');
  }
}
