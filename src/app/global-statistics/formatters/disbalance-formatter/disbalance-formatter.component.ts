import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/SystemMetric';
import {SasiColumn, SasiRow} from '../../../common/components/sasi-table/sasi-table.component';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';

@Component({
  selector: 'app-disbalance-formatter',
  templateUrl: './disbalance-formatter.component.html',
  styleUrls: ['./disbalance-formatter.component.css']
})
export class DisbalanceFormatterComponent implements OnInit {

  constructor() {
  }

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;
  private subData: SasiRow[] = [];
  private imbalancePerc = SystemMetricType.IMBALANCE_PERC;
  private imbalanceAbs = SystemMetricType.IMBALANCE_ABSOLUT;

  static isVisible(row) {
    if (row !== undefined && row.getCell(SystemMetricType.IMBALANCE_EVENTS) !== null && parseInt(row.getCell(SystemMetricType.IMBALANCE_EVENTS).value, 10) > 0) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    if (DisbalanceFormatterComponent.isVisible(this.rowData)) {
      this.subData = [this.rowData];
    }
    if (this.rowData !== undefined) {
      this.rowData.subRows.filter(
        subRow => DisbalanceFormatterComponent.isVisible(subRow)
      ).forEach(
        subRow => this.subData.push(subRow)
      );
    }
  }

  getInfoMessage() {
    return `Detected imbalance "${this.data.value}%" (${this.resolveAbsoluteDisbalance()} [MB/s])`;
  }

  private resolveAbsoluteDisbalance() {
    if (this.rowData !== undefined && this.rowData.getCell(SystemMetricType.IMBALANCE_ABSOLUT) != null) {
      return this.rowData.getCell(SystemMetricType.IMBALANCE_ABSOLUT).value;
    }
  }

  private getCellValue(row: SasiRow, type: SystemMetricType) {
    const metric = row.getCell(type);
    if (metric === null) {
      return '';
    }
    return metric.value;
  }

  private getUnit(row: SasiRow, type: SystemMetricType) {
    const metric = row.getCell(type);
    // console.log(metric);
    if (metric === null) {
      return '';
    }
    return metric.rawData.unit;
  }

  isAdapter(row: SasiRow) {
    return this.rowData.getCell('name').value === row.getCell('name').value;
  }

  private getIcon(row: SasiRow): string {
    if (this.isAdapter(row)) {
      return 'fas fa-server';
    }
    return 'fas fa-ethernet';
  }

  private getTooltip(row: SasiRow) {
    if (this.isAdapter(row)) {
      return 'Adapter';
    }
    return 'Port';
  }

}
