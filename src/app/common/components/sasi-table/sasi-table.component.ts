import {Component, Input, OnInit, Type} from '@angular/core';
import {AlertRule} from '../../../global-statistics/AlertRule';

/**
 * SasiColumn is metadata object for columns.
 */
export class SasiColumn {
  /**
   * @var index in data model
   */
  index: string;
  /**
   * @var label in header
   */
  label: string;
  /**
   * @var data formatter
   */
  component: Type<any>;

  constructor(index: string, label: string, component: Type<any>) {
    this.index = index;
    this.label = label;
    this.component = component;
  }
}

/**
 * SasiCell is data model for one cell in the table
 */
export class SasiCell {
  value: string;
  rawData: any;

  constructor(value: any, rawData: any) {
    this.value = value;
    this.rawData = rawData;
  }
}

/**
 * SasiRow is data model for row in the table
 */
export class SasiRow {

  public cells: SasiCell[] = [];

  getCellValue(columnIndex: SasiColumn): any {
    const cellData = this.getCell(columnIndex.index);
    return cellData !== null ? cellData.value : null;
  }

  getCellRawData(columnIndex: SasiColumn): SasiCell {
    const cellData = this.getCell(columnIndex.index);
    return cellData !== null ? cellData.rawData : null;
  }

  getCell(columnIndex: string): SasiCell {
    let cellData = this.cells[columnIndex];
    if (cellData === undefined) {
      console.error('Cannot find data in %s row, and columnIndex: %s', this.cells.toString(), columnIndex);
      cellData = null;
    }
    return cellData;
  }
}

export class SasiGroupRow {
  public groupRow: SasiRow;
  public rows: SasiRow[] = [];
}

/**
 * SasiTableOptions is class holding options to be set in table, and define behavior, features etc. for sasi table.
 */
export class SasiTableOptions {
  public columns: SasiColumn[] = [];
  public sortDescIcon;
  public sortAscIcon;
  public sortDefaultIcon;
  public sortColumnName: string;
  public sortType: SasiSortType;
  public altSortColumnName: string;
  public highlightColumn: boolean;
  public highlightRow: boolean;
  public colControlFormatter;
  public cellDecoratorRules: AlertRule[] = [];
}

export enum SasiSortType {
  ASC = 0,
  DESC = 1
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

  @Input() data: SasiRow[] = [];

  @Input() tableOptions: SasiTableOptions = new SasiTableOptions();

  options: SasiTableOptions;
  defaultOptions = {
    sortDescIcon: 'fa-sort-amount-desc',
    sortAscIcon: 'fa-sort-amount-asc',
    sortDefaultIcon: 'fa-sort',
    sortType: SasiSortType.ASC,
    altSortColumnName: null,
    highlightColumn: true,
    highlightRow: true,
    colControlFormatter: null,
    cellDecoratorRules: []
  };

  altSort = false;

  constructor() {
  }

  ngOnInit() {
    this.options = Object.assign(this.defaultOptions, this.tableOptions);
  }

  getColumnLabel(type: string) {
    const column: SasiColumn = this.options.columns.find(optionColumn => optionColumn.index === type);
    if (column === undefined) {
      return '';
    }
    return column.label;
  }


  /* SORTING FEATURES */
  getSortIconClass(column: string, isAltSort: boolean) {
    let sortIconClass = this.options.sortDefaultIcon;
    if (this.options.sortColumnName === column) {
      if (this.options.sortType === SasiSortType.ASC) {
        sortIconClass = this.options.sortAscIcon;
      } else {
        sortIconClass = this.options.sortDescIcon;
      }
    }
    if (this.altSort === isAltSort) {
      return sortIconClass;
    }
    return this.options.sortDefaultIcon;
  }

  setSort(column: SasiColumn, isAltSort: boolean) {
    if (this.options.sortColumnName === column.index) {
      if (this.options.sortType === SasiSortType.ASC) {
        this.options.sortType = SasiSortType.DESC;
      } else {
        this.options.sortType = SasiSortType.ASC;
      }
    } else {
      this.options.sortType = SasiSortType.ASC;
      this.options.sortColumnName = column.index;
    }
    this.altSort = isAltSort;
    this.data = this.sort(
      this.data,
      column,
      this.options.sortType,
      this.altSort ? this.options.altSortColumnName : null);
    // console.log(this.data);
  }

  sort(data, column: SasiColumn, sortType: SasiSortType, sortByRawValue: string) {
    const dataReturned = data.sort(
      (rowA, rowB) => {
        if (sortType === SasiSortType.ASC) {
          if (sortByRawValue !== null) {
            return this.compare(rowA.getCellRawData(column)[sortByRawValue], rowB.getCellRawData(column)[sortByRawValue]);
          } else {
            return this.compare(rowA.getCellValue(column), rowB.getCellValue(column));
          }
        } else {
          if (sortByRawValue !== null) {
            return this.compare(rowB.getCellRawData(column)[sortByRawValue], rowA.getCellRawData(column)[sortByRawValue]);
          } else {
            return this.compare(rowB.getCellValue(column), rowA.getCellValue(column));
          }
        }
      }
    );
    return dataReturned;
  }

  compare(valueA, valueB) {
    if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    }
    return 0;
  }


}
