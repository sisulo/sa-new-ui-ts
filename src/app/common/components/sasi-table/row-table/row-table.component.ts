import {Component, Input, OnInit} from '@angular/core';
import {SasiCell, SasiColumn, SasiRow, SasiTableOptions} from '../sasi-table.component';

@Component({
  selector: 'app-row-table',
  templateUrl: './row-table.component.html',
  styleUrls: ['./row-table.component.css']
})
export class RowTableComponent implements OnInit {

  @Input() data: SasiRow;
  @Input() columnHighlightEnable = false;
  @Input() options: SasiTableOptions;

  highlightedColumn = -1;

  constructor() {
  }

  ngOnInit() {
  }

  /* HIGHLIGHTNING */

  isColumnHighlighted(column: number) {
    if (!this.options.highlightColumn) {
      return false;
    }
    return column === this.highlightedColumn;
  }

  setHighlightedColumn(column: number) {
    this.highlightedColumn = column;
  }
}
