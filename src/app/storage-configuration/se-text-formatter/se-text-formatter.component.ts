import { Component, OnInit, Input } from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/system-metric.vo';
import {SasiColumn} from '../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-se-text-formatter',
  templateUrl: './se-text-formatter.component.html',
  styleUrls: ['./se-text-formatter.component.css']
})
export class SeTextFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  constructor() { }

  ngOnInit() {
  }

  getValue() {
    if (this.column === undefined) {
      return this.data['value'];
    }


    return this.data.value;
  }
}
