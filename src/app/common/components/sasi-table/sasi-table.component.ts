import {Component, Input, OnInit, Type} from '@angular/core';
import {AlertRule} from '../../../global-statistics/AlertRule';
import {LocalStorageService} from 'ngx-store';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AggregateValueService} from './row-group-table/row-group-table.component';
import {Sort} from './sort';
import {SelectedRow} from './row-table/selected-row';

/**
 * SasiColumn is metadata object for columns.
 */
export class SasiColumnBuilder {
  /**
   * @var index in data model
   */
  private index: string;
  /**
   * @var label in header
   */
  private label: string;
  /**
   * @var data formatter
   */
  private component: Type<any>;

  private altSortEnable = false;

  private isAggregated = false;

  private tooltipText: string = null;

  private infinity = true;

  private constructor() {
  }

  static getInstance(): SasiColumnBuilder {
    return new SasiColumnBuilder();
  }

  withIndex(index: string) {
    this.index = index;
    return this;
  }

  withLabel(label: string) {
    this.label = label;
    return this;
  }

  withComponent(component: Type<any>) {
    this.component = component;
    return this;
  }

  withAltSortEnable(altSortEnable: boolean) {
    this.altSortEnable = altSortEnable;
    return this;
  }

  withIsAggregated(isAggregated: boolean) {
    this.isAggregated = isAggregated;
    return this;
  }

  withTooltipText(tooltipText: string) {
    this.tooltipText = tooltipText;
    return this;
  }

  build(): SasiColumn {
    return new SasiColumn(
      this.index,
      this.label,
      this.component,
      this.altSortEnable,
      this.isAggregated,
      this.tooltipText === null ? this.label : this.tooltipText,
      this.infinity
    );
  }

  withInfinity(isInfinity: boolean) {
    this.infinity = isInfinity;
    return this;
  }
}

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

  isAggregated: boolean;

  tooltipText: string;

  isInfinity: boolean;

  constructor(
    index: string,
    label: string,
    component: Type<any>,
    altSortEnable: boolean,
    isAggragated: boolean,
    tooltipText: string,
    isInfinity: boolean
  ) {
    this.index = index;
    this.label = label;
    this.component = component;
    this.altSortEnable = altSortEnable;
    this.isAggregated = isAggragated;
    this.tooltipText = tooltipText;
    this.isInfinity = isInfinity;
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
      // console.error('Cannot find data in %s row, and columnIndex: %s', this.cells.toString(), columnIndex);
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
  public isDataGrouped: boolean;
  public selectableRows: boolean;
  public colControlFormatter;
  public rowComponentFormatter;
  public grIndexComponentFormatter;
  public cellDecoratorRules: AlertRule[] = [];
  public valueColumnWidth: string;
  public labelColumnWidth: string;
  public storageNamePrefix: string;
  public sortService: Sort;
  public aggregateValuesService: AggregateValueService;
  public columnAlign: string;

  getColumnWidth(name) { // TODO should be part of the SasiTableOptions but Object.assign will not copy it
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
  collapsedRows: Array<string>;
  selectedRows: Array<SelectedRow>;

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
    selectableRows: false,
    colControlFormatter: null,
    cellDecoratorRules: [],
    rowComponentFormatter: null,
    grIndexComponentFormatter: null,
    aggregateColumns: [],
    sortService: null,
    storageNamePrefix: 'sasi_default',
    columnAlign: 'center',
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

  constructor(private localStorageService: LocalStorageService) {

  }

  ngOnInit() {
    this.options = Object.assign(this.defaultOptions, this.tableOptions);
    this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
      data => this.selectedRows = data.newValue
    );
    this.localStorageService.observe(this.options.storageNamePrefix + '_collapsed').subscribe(
      data => {
        this.collapsedRows = data.newValue;
      }
    );
    this.selectedRows = this.localStorageService.get(this.options.storageNamePrefix + '_selected');
    this.collapsedRows = this.localStorageService.get(this.options.storageNamePrefix + '_collapsed');
    if (this.selectedRows === null) {
      this.selectedRows = [];
    } else {
      this.selectedRows = this.selectedRows; // this must be reset because save on the collapsedRows doesn't work
    }
    if (this.collapsedRows === null) {
      this.collapsedRows = [];
    } else {
      this.collapsedRows = this.collapsedRows; // this must be reset because save on the collapsedRows doesn't work
    }
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
    this.data = this.options.sortService.sort(
      this.data,
      column,
      this.options.sortType,
      this.altSort ? this.options.altSortColumnName : null,
      ((row, column1) => row.getCellValue(column1)));
  }

  collapseAll() {
    // @ts-ignore
    const d = <SasiGroupRow[]>this.data;

    if (this.isCollapseAll()) {
      d.forEach(
        value =>
          this.collapsedRows = this.collapsedRows.filter(
            collapsedRowValue => collapsedRowValue !== value.groupRow.getCell('name').value
          )
      );
    } else {
      d.forEach(value => this.collapsedRows.push(value.groupRow.getCell('name').value));
    }
    this.localStorageService.set(this.options.storageNamePrefix + '_collapsed', this.collapsedRows);
  }

  isCollapseAll(): boolean {
    return this.data.every(
      // @ts-ignore
      row => this.collapsedRows.includes(row.groupRow.getCell('name').value)
    );
  }

  isSelectedAll(): boolean {
    if (!this.options.isDataGrouped) {
      return false;
    }
    // @ts-ignore
    const d = <SasiGroupRow[]>this.data;
    return d.every(
      // @ts-ignore
      rowGroup => rowGroup.rows.every(
        row => this.selectedRows.find(selectedRow => selectedRow.rowName === row.getCell('name').value && selectedRow.groupName === rowGroup.groupRow.getCell('name').value
        ) !== undefined
      )
    );
  }

  isPartiallySelected() {
    if (!this.options.isDataGrouped) {
      return false;
    }
    // @ts-ignore
    const d = <SasiGroupRow[]>this.data;
    return d.find(
      // @ts-ignore
      rowGroup => rowGroup.rows.find(
        row => this.selectedRows.find(
          selectedRow => selectedRow.rowName === row.getCell('name').value && selectedRow.groupName === rowGroup.groupRow.getCell('name').value
        ) !== undefined
      )
    ) !== undefined;
  }

  selectAll() {
    // @ts-ignore
    const d = <SasiGroupRow[]>this.data;
    if (!this.isSelectedAll()) {
      this.selectedRows = [];
      d.forEach(
        rowGroup => rowGroup.rows.forEach(
          row => this.selectedRows.push(new SelectedRow(rowGroup.groupRow.getCell('name').value, row.getCell('name').value))
        )
      );
    } else {
      d.forEach(
        groupRow =>
          groupRow.rows.forEach(
            row => this.selectedRows.splice(
              this.selectedRows.findIndex(
                selectedRow => selectedRow.groupName === groupRow.groupRow.getCell('name').value && selectedRow.rowName === row.getCell('name').value
              ), 1
            )
          )
      );
    }
    this.localStorageService.set(this.options.storageNamePrefix + '_selected', this.selectedRows);

  }
}
