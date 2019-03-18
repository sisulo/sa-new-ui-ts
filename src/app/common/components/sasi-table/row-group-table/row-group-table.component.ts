import {Component, Input, OnInit} from '@angular/core';
import {SasiColumn, SasiGroupRow, SasiTableOptions, slideInOutAnimation} from '../sasi-table.component';
import {LocalStorage} from 'ngx-store';

@Component({
  selector: 'app-row-group-table',
  templateUrl: './row-group-table.component.html',
  styleUrls: ['./row-group-table.component.css'],
  animations: slideInOutAnimation
})
export class RowGroupTableComponent implements OnInit {

  @Input() data: SasiGroupRow;
  @Input() columnHighlightEnable = false;
  @Input() options: SasiTableOptions;
  @LocalStorage({key: 'sasi_collapsed'}) collapsedRows: Array<string>;

  aggregatedValues = {};

  constructor() {
    if (this.collapsedRows === null) {
      this.collapsedRows = [];
    } else {
      this.collapsedRows = this.collapsedRows; // this must be reset because save on the collapsedRows doesn't work
    }

  }

  ngOnInit() {
    this.aggregateValues();
  }

  addCollapsed(systemName: string) {
    if (this.collapsedRows === null) {
      this.collapsedRows = [];
    }
    const index = this.collapsedRows.findIndex(name => name === systemName);
    if (index > -1) {
      this.collapsedRows.splice(index, 1);
    } else {
      this.collapsedRows.push(systemName);
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapsed(systemName: string): boolean {
    return this.collapsedRows.findIndex(value => value === systemName) > -1;
  }

  private aggregateValues() {
    this.options.getAggregatedColumns().forEach(
      column => {
        this.aggregatedValues[column.index] = this.data.rows.map(
          (row) => {
            return row.getCellValue(column);
          }
        ).reduce(
          (valueA, valueB) => valueA + valueB
        );
      }
    );
  }
}
