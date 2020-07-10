import {Component, OnInit, Input} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiRow} from '../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-serial-number-formatter',
  templateUrl: './serial-number-formatter.component.html',
  styleUrls: ['./serial-number-formatter.component.css']
})
export class SerialNumberFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;

  constructor() {
  }

  ngOnInit() {
    console.log(this.data);
    console.log(this.rowData);
  }

  getValue() {
    if (this.rowData.cells['serialNumber'] !== undefined || this.rowData.cells['prefixReferenceId'] !== undefined) {
      return [this.rowData.cells['prefixReferenceId'].value, this.rowData.cells['serialNumber'].value].join(' ');
    }
    return null;
  }
}
