import {Component, Input, OnInit, Type} from '@angular/core';
import {AlertRule} from '../../../global-statistics/alert-rule';
import {LocalStorageService} from 'ngx-store';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AggregatedValues, AggregateValueService} from './row-group-table/row-group-table.component';
import {Sort} from './sort';
import {SelectedRow} from './row-table/selected-row';
import {OnSelectService} from './on-select.service';
import {SystemMetricType} from '../../models/metrics/system-metric-type.enum';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

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

  private shortLabel: string;
  /**
   * @var data formatter
   */
  private component: Type<any>;
  private aggComponent: Type<any>;

  private altSortEnable = false;

  private isAggregated = false;

  private tooltipText: string = null;
  private columnTooltipText: string = null;

  private infinity = true;

  private altLabel;

  private altBorder = false;

  private altBorderLeft = false;

  private columnWidth = null;

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

  withAltLabel(label: string) {
    this.altLabel = label;
    return this;
  }

  withComponent(component: Type<any>) {
    this.component = component;
    return this;
  }

  withAggComponent(component: Type<any>) {
    this.aggComponent = component;
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

  withAltBorder(altBorder: boolean) {
    this.altBorder = altBorder;
    return this;
  }

  withAltBorderLeft(altBorder: boolean) {
    this.altBorderLeft = altBorder;
    return this;
  }

  withColumnWidth(width: string) {
    this.columnWidth = width;
    return this;
  }

  withColumnTooltipText(text: string) {
    this.columnTooltipText = text;
    return this;
  }

  build(): SasiColumn {
    return new SasiColumn(
      this.index,
      this.label,
      this.component,
      this.aggComponent === undefined ? this.component : this.aggComponent,
      this.altSortEnable,
      this.isAggregated,
      this.tooltipText === null ? this.label : this.tooltipText,
      this.infinity,
      this.altLabel,
      this.altBorder,
      this.altBorderLeft,
      this.columnWidth,
      this.columnTooltipText,
      this.shortLabel === undefined ? this.label : this.shortLabel
    );
  }

  withInfinity(isInfinity: boolean) {
    this.infinity = isInfinity;
    return this;
  }

  withShortLabel(shortLabel: string) {
    this.shortLabel = shortLabel;
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

  shortLabel: string;
  /**
   * @var data formatter
   */
  component: Type<any>;
  aggComponent: Type<any>;

  altSortEnable: boolean;

  isAggregated: boolean;

  tooltipText: string;
  columnTooltipText: string;

  isInfinity: boolean;

  altLabel: string;

  altBorder: boolean;
  altBorderLeft: boolean;

  columnWidth: string;

  constructor(
    index: string,
    label: string,
    component: Type<any>,
    aggComponent: Type<any>,
    altSortEnable: boolean,
    isAggragated: boolean,
    tooltipText: string,
    isInfinity: boolean,
    altLabel: string,
    altBorder: boolean,
    altBorderLeft: boolean,
    columnWidth: string,
    columnTooltipText: string,
    shortLabel: string
  ) {
    this.index = index;
    this.label = label;
    this.component = component;
    this.aggComponent = aggComponent;
    this.altSortEnable = altSortEnable;
    this.isAggregated = isAggragated;
    this.tooltipText = tooltipText;
    this.isInfinity = isInfinity;
    this.altLabel = altLabel;
    this.altBorder = altBorder;
    this.altBorderLeft = altBorderLeft;
    this.columnWidth = columnWidth;
    this.columnTooltipText = columnTooltipText;
    this.shortLabel = shortLabel;
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

export class SasiExternal {
  type: SystemMetricType;
  value: string;

  constructor(type: SystemMetricType, value: string) {
    this.type = type;
    this.value = value;
  }
}

/**
 * SasiRow is data model for row in the table
 */
export class SasiRow {

  public subRows: SasiRow[] = [];
  public cells: SasiCell[] = [];
  public externals: SasiExternal[] = [];

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
  public aggregatedValues: AggregatedValues;
}

export interface HeaderGroup {
  name: string;
  columns: SystemMetricType[] | string[];
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
  public alertColumnSize: string;
  public controlColumnSize: string;
  public nameColumnSize: string;
  public headerGroups: HeaderGroup[];

  getColumnWidth(name) { // TODO should be part of the SasiTableOptions but Object.assign will not copy it
    const columnOption = this.columns.find(column => column.index === name);
    if (columnOption !== undefined && columnOption.columnWidth !== null) {
      return columnOption.columnWidth;
    }
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

  getDataColumns(): SasiColumn[] {
    return this.columns.filter(column => column.index !== 'name');
  }
}

export enum SasiSortType {
  ASC = 0,
  DESC = 1
}

export const slideInOutAnimation = [ // TODO reuse animation in all collapsed sasi-table group
  trigger('slideInOut', [
    state('true', style({display: 'none'})),
    state('false', style({display: '*'})),
    transition('1 => 0', animate('200ms ease-in')),
    transition('0 => 1', animate('200ms ease-out'))
  ]),
  trigger('iconRotate', [
    state('false', style({transform: 'rotate(0deg)'})),
    state('true', style({transform: 'rotate(90deg)'})),
    transition('1 => 0', animate('200ms')),
    transition(':enter', animate('0ms')),
    transition(':leave', animate('0ms')),
    transition('0 => 1', animate('200ms'))
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
    controlColumnSize: '30px',
    alertColumnSize: '40px',
    nameColumnSize: '130px',
    headerGroups: [],
    getColumnWidth(name) { // TODO should be part of the SasiTableOptions but Object.assign will not copy it
      const columnOption = this.columns.find(column => column.index === name);
      if (columnOption !== undefined && columnOption.columnWidth !== null) {
        return columnOption.columnWidth;
      }
      if (name === 'name') {
        return this.labelColumnWidth;
      }
      return this.valueColumnWidth;
    },

    getAggregatedColumns() {
      return this.columns.filter(
        column => column.isAggregated
      );
    },
    getDataColumns(): SasiColumn[] {
      return this.columns.filter(column => column.index !== 'name');
    }
  };

  altSort = false;
  style: SafeStyle;

  constructor(private localStorageService: LocalStorageService,
              private onSelectService: OnSelectService,
              private domSanitizer: DomSanitizer) {

  }

  async ngOnInit() {
    console.log(this.data);
    this.options = Object.assign(this.defaultOptions, this.tableOptions);
    this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
      data => this.selectedRows = data.newValue
    );
    this.localStorageService.observe(this.options.storageNamePrefix + '_collapsed').subscribe(
      data => {
        this.collapsedRows = data.newValue;
      }
    );
    this.selectedRows = await this.localStorageService.get(this.options.storageNamePrefix + '_selected');
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
    this.style = this.domSanitizer.bypassSecurityTrustStyle(
      'grid-template-columns: ' + this.getColControlSize() + ' ' + this.getAlertColumnSize() +
      ' ' + this.getNameColumnSize() + ' repeat(' + this.getGridColumnCount() + ', 1fr);');
  }

  getGridColumnCount() {
    return this.options.columns.length - 1;
  }

  getNameColumnSize() {
    return this.options.nameColumnSize;
  }

  getColControlSize() {
    return this.options.controlColumnSize;
  }

  getAlertColumnSize() {
    return this.options.isDataGrouped && this.options.cellDecoratorRules.length > 0 ? this.options.alertColumnSize : '';
  }

  getColumnLabel(type: string) {
    const column: SasiColumn = this.options.columns.find(optionColumn => optionColumn.index === type);
    if (column === undefined) {
      return '';
    }
    if (this.options.headerGroups.length > 0) {
      return column.shortLabel;
    }
    return column.altLabel !== undefined ? column.altLabel : column.label;
  }

  getColumnTooltipText(type: string) {
    const column: SasiColumn = this.options.columns.find(optionColumn => optionColumn.index === type);
    if (column === undefined) {
      return '';
    }
    return column.columnTooltipText !== null ? column.columnTooltipText : this.getColumnLabel(type);
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
      this.options.sortType = SasiSortType.DESC;
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
    if (this.collapsedRows === undefined) {
      return false;
    }
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
    if (this.selectedRows === undefined) {
      return false;
    }
    return d.every(
      // @ts-ignore
      rowGroup => rowGroup.rows.every(
        row => this.selectedRows.find(selectedRow => this.isSelected(row, selectedRow, rowGroup)
        ) !== undefined
      )
    );
  }

  private isSelected(row: SasiRow, selectedRow: SelectedRow, rowGroup: SasiGroupRow) {
    return selectedRow.rowName === row.getCell('name').value && selectedRow.groupName === rowGroup.groupRow.getCell('name').value;
  }

  isPartiallySelected() {
    if (!this.options.isDataGrouped) {
      return false;
    }
    // @ts-ignore
    const d = <SasiGroupRow[]>this.data;
    if (this.selectedRows === undefined) {
      return false;
    }
    return d.find(
      // @ts-ignore
      rowGroup => rowGroup.rows.find(
        row => this.selectedRows.find(
          selectedRow => this.isSelected(row, selectedRow, rowGroup)
        ) !== undefined
      )
    ) !== undefined;
  }

  selectAll() {

    // // @ts-ignore
    // const d = <SasiGroupRow[]>this.data;
    if (!this.isSelectedAll()) {
      this.onSelectService.announceSelectAll(true);
    } else {
      this.onSelectService.announceSelectAll(false);
    }
  }

  getColumns() {
    // if (this.options.headerGroups.length > 0) {
    //   return this.options.headerGroups;
    // }
    return this.options.columns;
  }

  getHeaderGridStyle(i: number) {
    const offsetPosition = 1;
    const groupsBefore = this.options.headerGroups.slice(0, i);
    const startPosition = groupsBefore.reduce((previousValue, currentValue) => previousValue + currentValue.columns.length, offsetPosition);
    const headerGroup = this.options.headerGroups[i];
    const endPosition = startPosition + headerGroup.columns.length;
    return this.domSanitizer.bypassSecurityTrustStyle(
      'grid-column-start: ' + startPosition + ';' +
      'grid-column-end: ' + endPosition + ';' +
      'grid-row-start: 1;'
    );

  }
}
