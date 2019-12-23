import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiRow} from '../../../common/components/sasi-table/sasi-table.component';
import {SystemMetricType} from '../../../common/models/metrics/system-metric-type.enum';

@Component({
  selector: 'app-port-disbalance-formatter',
  templateUrl: './port-disbalance-formatter.component.html',
  styleUrls: ['./port-disbalance-formatter.component.css']
})
export class PortDisbalanceFormatterComponent implements OnInit {

  constructor() {
  }

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;
  private subData: SasiRow[] = [];
  private imbalanceEvents = SystemMetricType.PORT_IMBALANCE_EVENTS;

  static isVisible(row) {
    if (row !== undefined && row.getCell(SystemMetricType.PORT_IMBALANCE_EVENTS) !== null && parseInt(row.getCell(SystemMetricType.PORT_IMBALANCE_EVENTS).value, 10) > 0) {
      return true;
    }
    return false;
  }

  ngOnInit() {
    if (this.rowData !== undefined) {
      this.rowData.subRows.filter(
        subRow => PortDisbalanceFormatterComponent.isVisible(subRow)
      ).forEach(
        subRow => this.subData.push(subRow)
      );
    }
  }

  private resolveAbsoluteDisbalance() {
    if (this.rowData !== undefined && this.rowData.getCell(SystemMetricType.PORT_IMBALANCE_ABSOLUT) != null) {
      return this.rowData.getCell(SystemMetricType.PORT_IMBALANCE_ABSOLUT).value;
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
    if (metric === null) {
      return '';
    }
    return metric.rawData.unit;
  }

}
