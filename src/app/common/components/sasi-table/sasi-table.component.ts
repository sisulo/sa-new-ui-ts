import {Component, Input, OnInit, Type} from '@angular/core';
import {SortType} from '../../../global-statistics/div-table/div-table';

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
  public sortDescIcon;
  public sortAscIcon;
  public sortDefaultIcon;
  public sortColumnName: string;
  public sortType: SasiSortType;
  public sortByRawValue: string;
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

  @Input() data = [];

  @Input() tableOptions: SasiTableOptions = new SasiTableOptions();

  options: SasiTableOptions;
  defaultOptions = {
    sortDescIcon: 'fa-sort-amount-desc',
    sortAscIcon: 'fa-sort-amount-asc',
    sortDefaultIcon: 'fa-sort',
    sortType: SasiSortType.ASC,
    sortByRawValue: null
  };
  constructor() {
  }

  ngOnInit() {
    this.options = Object.assign(this.tableOptions, this.defaultOptions);
    console.log(this.options);
  }

  getColumnLabel(type: string) {
    const column: SasiColumn = this.options.columns.find(optionColumn => optionColumn.index === type);
    if (column === undefined) {
      return '';
    }
    return column.label;
  }

  getCell(row, columnIndex: SasiColumn): SasiCell {
    let cellData = row[columnIndex.index];
    if (cellData === undefined) {
      console.error('Cannot find data in %s row, and columnIndex: %s', row.toString(), columnIndex.index);
      cellData = null;
    }
    return cellData;
  }

  getCellValue(row, columnIndex: SasiColumn): any {
    const cellData = this.getCell(row, columnIndex);
    return cellData !== null ? cellData.value : null;
  }

  getCellRawData(row, columnIndex: SasiColumn): SasiCell {
    const cellData = this.getCell(row, columnIndex);
    return cellData !== null ? cellData.rawData : null;
  }

  getSortIconClass(column: string) {
    if (this.options.sortColumnName === column) {
      if (this.options.sortType === SasiSortType.ASC) {
        return this.options.sortAscIcon;
      } else {
        return this.options.sortDescIcon;
      }
    }
    return this.options.sortDefaultIcon;
  }

  setSort(column: SasiColumn, sortByRawValue: string) {
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
    this.options.sortByRawValue = sortByRawValue; // TODO maybe not necessary to store rawColumnName to sorting data by
    console.log(this.options.sortType);
    this.data = this.sort(this.data, column, this.options.sortType, this.options.sortByRawValue);
    // console.log(this.data);
  }

  sort(data, column: SasiColumn, sortType: SasiSortType, sortByRawValue: string) {
    const dataReturned = data.sort(
      (rowA, rowB) => {
          if (sortType === SasiSortType.ASC) {
            if (sortByRawValue !== null) {
              return this.compare(this.getCellRawData(rowA, column)[sortByRawValue], this.getCellRawData(rowB, column)[sortByRawValue]);
            } else {
              return this.compare(this.getCellValue(rowA, column), this.getCellValue(rowB, column));
            }
          } else {
            if (sortByRawValue !== null) {
              return this.compare(this.getCellValue(rowB, column)[sortByRawValue], this.getCellValue(rowA, column)[sortByRawValue]);
            } else {
              return this.compare(this.getCellValue(rowB, column), this.getCellValue(rowA, column));
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
