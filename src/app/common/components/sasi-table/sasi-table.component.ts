import {Component, Input, OnInit, Type} from '@angular/core';
import {count} from 'rxjs/operators';

export class SasiColumn {
  index: string;
  label: string;
  component: Type<any>;

  constructor(index: string, label: string, component: Type<any>) {
    this.index = index;
    this.label = label;
    this.component = component;
  }
}

export class SasiCell {
  value: string;
  rawData: any;

  constructor(value: any, rawData: any) {
    this.value = value;
    this.rawData = rawData;
  }
}

export class SasiTableOptions {
  public columns: SasiColumn[] = [];
}

@Component({
  selector: 'app-sasi-table',
  templateUrl: './sasi-table.component.html',
  styleUrls: ['./sasi-table.component.css']
})
/**
 * Storage analytics simple interactive table
 */
export class SasiTableComponent implements OnInit {

  @Input() data = [];

  @Input() options: SasiTableOptions = new SasiTableOptions();


  constructor() {
  }

  ngOnInit() {
  }

  getColumnLabel(type: string) {
    const column: SasiColumn = this.options.columns.find(optionColumn => optionColumn.index === type);
    if (column === undefined) {
      return '';
    }
    return column.label;
  }

  getCell(row: [], columnIndex: SasiColumn) {
    let cellData = row[columnIndex.index];
    if (cellData === undefined) {
      console.error('Cannot find data in %s row, and columnIndex: %s', row.toString(), columnIndex.index);
      cellData = null;
    }
    return cellData;
  }

  getCellValue(row: [], columnIndex: SasiColumn) {
    const cellData = this.getCell(row, columnIndex);
    return cellData !== null ? cellData.value : null;
  }

  getCellRawData(row: [], columnIndex: SasiColumn) {
    const cellData = this.getCell(row, columnIndex);
    return cellData !== null ? cellData : null;
  }
}
