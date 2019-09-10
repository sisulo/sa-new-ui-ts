import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SasiRow, SasiTableOptions} from '../sasi-table.component';
import {LocalStorage, LocalStorageService} from 'ngx-store';
import {SelectedRow} from './selected-row';

@Component({
  selector: 'app-row-table',
  templateUrl: './row-table.component.html',
  styleUrls: ['./row-table.component.css']
})
export class RowTableComponent implements OnInit {

  @Input() data: SasiRow;
  @Input() groupName: string;
  @Input() columnHighlightEnable = false;
  @Input() options: SasiTableOptions;
  @Output() selectEmit = new EventEmitter<Array<SelectedRow>>();
  selectedRows: Array<SelectedRow>;

  @LocalStorage() highlightedColumn = -1;

  constructor(private localStorageService: LocalStorageService
  ) {
  }

  async ngOnInit() {
    // this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
    //   data => {
    //     this.selectedRows = data.newValue;
    //   }
    // );
    this.selectedRows = await this.localStorageService.get(this.options.storageNamePrefix + '_selected');
    if (this.selectedRows === null) {
      this.selectedRows = [];
    }

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

  isSelectedRow(name: string): boolean {
    return this.findIndex(name) > -1;
  }

  selectRow(name: string) {
    this.selectedRows = this.localStorageService.get(this.options.storageNamePrefix + '_selected');
    if (this.selectedRows === null) {
      this.selectedRows = [];
    }
    const index = this.findIndex(name);
    if (index > -1) {
      this.selectedRows.splice(index, 1);
    } else {
      this.selectedRows.push(new SelectedRow(this.groupName, name));
    }
    // @ts-ignore
    this.localStorageService.set(this.options.storageNamePrefix + '_selected', this.selectedRows);
    this.selectEmit.emit(this.selectedRows);
  }

  findIndex(name: string) {
    if (this.selectedRows === undefined) {
      return -1;
    }
    return this.selectedRows.findIndex(value => value.rowName === name && value.groupName === this.groupName);
  }
}
