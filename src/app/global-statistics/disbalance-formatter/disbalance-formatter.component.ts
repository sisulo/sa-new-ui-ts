import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SasiColumn, SasiRow} from '../../common/components/sasi-table/sasi-table.component';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';

@Component({
  selector: 'app-disbalance-formatter',
  templateUrl: './disbalance-formatter.component.html',
  styleUrls: ['./disbalance-formatter.component.css']
})
export class DisbalanceFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;

  constructor() {
  }

  ngOnInit() {
  }

  getInfoMessage() {
    return `Warning: Channel Adapter Pair Imbalance "${this.data.value}" (${this.resolveAbsoluteDisbalance()} [MB/s])`;
  }

  private resolveAbsoluteDisbalance() {
    if (this.rowData !== undefined && this.rowData.getCell(SystemMetricType.IMBALANCE_ABSOLUT) != null) {
      return this.rowData.getCell(SystemMetricType.IMBALANCE_ABSOLUT).value;
    }
  }

}
