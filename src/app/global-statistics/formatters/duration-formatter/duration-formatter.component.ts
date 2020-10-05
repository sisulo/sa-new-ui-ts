import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';
import {SasiColumn} from '../../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-duration-formatter',
  templateUrl: './duration-formatter.component.html',
  styleUrls: ['./duration-formatter.component.css']
})
export class DurationFormatterComponent implements OnInit {

  @Input() public data: SystemMetric;
  @Input() public label;
  @Input() public column: SasiColumn;

  constructor() {
  }

  ngOnInit() {
  }

  getValue() {
    return (this.data.endTime - this.data.startTime) / 1000;
  }
}
