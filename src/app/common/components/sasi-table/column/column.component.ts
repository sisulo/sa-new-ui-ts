import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy} from '@angular/core';
import {SasiColumn, SasiRow, SasiTableOptions, slideInOutAnimation} from '../sasi-table.component';
import {HighlightColumnService} from '../highlight-column.service';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: slideInOutAnimation
})
export class ColumnComponent implements OnInit, OnDestroy {

  @Input() options: SasiTableOptions;
  @Input() column: SasiColumn;
  @Input() colIndex = -1;
  @Input() data: SasiRow;
  @Input() isCollapsed = false;

  highlightedColumn = -1;

  highLightSubscription;

  constructor(private highlightColumnService: HighlightColumnService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.highLightSubscription = this.highlightColumnService.highlightColumn$.subscribe(
      columnIndex => {

        if (this.highlightedColumn === this.colIndex || columnIndex === this.colIndex) {
          // this.highlightedColumn = columnIndex;
          this.cd.markForCheck();
        }
        this.highlightedColumn = columnIndex;
      }
    );
  }

  ngOnDestroy(): void {
    this.highLightSubscription.unsubscribe();
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
