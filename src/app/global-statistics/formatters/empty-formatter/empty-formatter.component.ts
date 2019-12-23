import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiRow} from '../../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-empty-formatter',
  templateUrl: './empty-formatter.component.html',
  styleUrls: ['./empty-formatter.component.css']
})
export class EmptyFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;

  constructor() {
  }

  ngOnInit() {
  }

}
