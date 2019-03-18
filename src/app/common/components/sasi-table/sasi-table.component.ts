import {Component, Input, OnInit, Type} from '@angular/core';
import {AlertRule} from '../../../global-statistics/AlertRule';
import {LocalStorage} from 'ngx-store';
import {animate, animation, state, style, transition, trigger} from '@angular/animations';

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

  altSortEnable: boolean;

  isAggregated: boolean

  constructor(index: string, label: string, component: Type<any>, altSortEnable: boolean, isAggragated: boolean) {
    this.index = index;
    this.label = label;
    this.component = component;
    this.altSortEnable = altSortEnable;
    this.isAggregated = isAggragated;
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
  public aggregateColumns: [] = [];
  public sortDescIcon;
  public sortAscIcon;
  public sortDefaultIcon;
  public sortColumnName: string;
  public sortType: SasiSortType;
  public altSortColumnName: string;
  public highlightColumn: boolean;
  public highlightRow: boolean;
  public isDataGrouped: boolean;
  public colControlFormatter;
  public rowComponentFormatter;
  public cellDecoratorRules: AlertRule[] = [];
  public valueColumnWidth: string;
  public labelColumnWidth: string;

  getColumnWidth (name) { // TODO should be part of the SasiTableOptions but Object.assign will not copy it
    if (name === 'name') {
      return this.labelColumnWidth;
    }
    return this.valueColumnWidth;
  }

  getAggregatedColumns(): SasiColumn[] {
    return this.columns.filter(
      column => column.isAggregated
    );
  }
}

export enum SasiSortType {
  ASC = 0,
  DESC = 1
}

export const slideInOutAnimation = [ // TODO reuse animation in all collapsed sasi-table group
  trigger('slideInOut', [
    state('true', style({height: '0px', overflow: 'hidden', margin: '0'})),
    state('false', style({'height': '*', overflow: 'hidden', margin: '0'})),
    transition('1 => 0', animate('500ms ease-in')),
    transition('0 => 1', animate('500ms ease-out'))
  ]),
  trigger('iconRotate', [
    state('false', style({transform: 'rotate(0deg)'})),
    state('true', style({transform: 'rotate(90deg)'})),
    transition('1 => 0', animate('500ms')),
    transition(':enter', animate('0ms')),
    transition(':leave', animate('0ms')),
    transition('0 => 1', animate('500ms'))
  ])
];

@Component({
  selector: 'app-sasi-table',
  templateUrl: './sasi-table.component.html',
  styleUrls: ['./sasi-table.component.css'],
  animations: slideInOutAnimation
})
/**
 * Storage analytics simple interactive table
 */
export class SasiTableComponent implements OnInit {

  @Input() data: SasiRow[] = [];
  @Input() tableOptions: SasiTableOptions = new SasiTableOptions();
  @LocalStorage({key: 'sasi_collapsed'}) collapsedRows: Array<string>;

  options: SasiTableOptions;
  defaultOptions = {
    sortDescIcon: 'glyphicon glyphicon-sort-by-attributes-alt',
    sortAscIcon: 'glyphicon glyphicon-sort-by-attributes',
    sortDefaultIcon: 'glyphicon glyphicon-sort',
    sortType: SasiSortType.ASC,
    altSortColumnName: null,
    highlightColumn: true,
    highlightRow: true,
    valueColumnWidth: '',
    labelColumnWidth: '',
    isDataGrouped: false,
    colControlFormatter: null,
    cellDecoratorRules: [],
    rowComponentFormatter: null,
    aggregateColumns: [],
    getColumnWidth: function (name) { // TODO should be part of the SasiTableOptions but Object.assign will not copy it
      if (name === 'name') {
        return this.labelColumnWidth;
      }
      return this.valueColumnWidth;
    },

    getAggregatedColumns() {
      return this.columns.filter(
        column => column.isAggregated
      );
    }
  };

  altSort = false;

  constructor() {
    if (this.collapsedRows === null) {
      this.collapsedRows = [];
    } else {
      this.collapsedRows = this.collapsedRows; // this must be reset because save on the collapsedRows doesn't work
    }
  }

  ngOnInit() {
    this.options = Object.assign(this.defaultOptions, this.tableOptions);
    console.log(this.options);
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

  collapseAll() {
    // @ts-ignore
    const d = <SasiGroupRow[]>this.data;

    if (this.isCollapseAll()) {
      d.forEach(
        value => this.collapsedRows.splice(
          this.collapsedRows.findIndex(
            collapsedRowValue => collapsedRowValue === value.groupRow.getCell('name').value
          ), 1
        )
      );
    } else {
      d.forEach(value => this.collapsedRows.push(value.groupRow.getCell('name').value));
    }
    // @ts-ignore
    this.collapsedRows.save();
  }

  isCollapseAll(): boolean {
    return this.data.every(
      // @ts-ignore
      row => this.collapsedRows.includes(row.groupRow.getCell('name').value)
    );
  }
}
