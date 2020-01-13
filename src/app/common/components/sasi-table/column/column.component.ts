import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {SasiColumn, SasiRow, SasiTableOptions} from '../sasi-table.component';
import {HighlightColumnService} from '../highlight-column.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnComponent implements OnInit {

  @Input() options: SasiTableOptions;
  @Input() column: SasiColumn;
  @Input() colIndex = -1;
  @Input() data: SasiRow;

  highlightedColumn = -1;

  constructor(private highlightColumnService: HighlightColumnService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.highlightColumnService.highlightColumn$.subscribe(
      columnIndex => {

        if (this.highlightedColumn === this.colIndex || columnIndex === this.colIndex) {
          // this.highlightedColumn = columnIndex;
          this.cd.markForCheck();
        }
        this.highlightedColumn = columnIndex;
      }
    );
  }


  isColumnHighlighted(column: number) {
    if (!this.options.highlightColumn) {
      return false;
    }
    return column === this.highlightedColumn;
  }

  setHighlightedColumn(column: number) {
    this.highlightColumnService.setHighlightColumn(column);
  }
}
