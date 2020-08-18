import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {SasiGroupRow, SasiTableOptions, slideInOutAnimation} from '../sasi-table.component';
import {LocalStorageService} from 'ngx-store-9';
import {SystemMetricType} from '../../../models/metrics/system-metric-type.enum';
import {SelectedRow} from '../row-table/selected-row';
import {keys} from 'd3-collection';
import {ConditionEvaluateUtils} from '../../../../global-statistics/utils/condition-evaluate.utils';
import {Metric} from '../../../models/metrics/metric.vo';
import {HighlightColumnService} from '../highlight-column.service';

export interface AggregatedValues {
  getValue(name: SystemMetricType | string): Metric;
}

export interface AggregateValueService {
  computeSummaries(inputRowGroup: SasiGroupRow[], filter: Array<SelectedRow>, options: SasiTableOptions): AggregatedValues;
}

class AlertSummaryValue {
  type: string;
  count: number;

  constructor(type: string, count: number) {
    this.type = type;
    this.count = count;
  }
}

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
  highlightedColumn = -1;

  aggregatedValues = {};
  @Input() selectedRows: Array<SelectedRow>;
  collapsedRows: Array<string> = [];

  alertSummary = [];

  constructor(private localStorageService: LocalStorageService,
              private highlightColumnService: HighlightColumnService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    // TODO refactor this to the service
    this.localStorageService.observe(this.options.storageNamePrefix + '_selected').subscribe(
      data => {
        this.selectedRows = data.newValue;
        this.initAggregatedValues();
      }
    );
    this.localStorageService.observe(this.options.storageNamePrefix + '_collapsed').subscribe(
      data => {
        this.collapsedRows = data.newValue;
      }
    );
    this.highlightColumnService.highlightColumn$.subscribe(
      columnIndex => {
        this.highlightedColumn = columnIndex;
        this.cd.markForCheck();
      }
    );

    this.selectedRows = this.localStorageService.get(this.options.storageNamePrefix + '_selected');
    this.collapsedRows = this.localStorageService.get(this.options.storageNamePrefix + '_collapsed');
    if (this.selectedRows == null) {
      this.selectedRows = [];
    } else {
      this.selectedRows = this.selectedRows; // this must be reset because save on the collapsedRows doesn't work
    }
    if (this.collapsedRows === null) {
      this.collapsedRows = [];
    } else {
      this.collapsedRows = this.collapsedRows; // this must be reset because save on the collapsedRows doesn't work
    }
    this.initAggregatedValues();
    this.summarizeAlerts();

  }

  initAggregatedValues() {
    if (this.selectedRows === null) {
      this.selectedRows = [];
    }
    if (this.options.aggregateValuesService !== undefined && this.options.aggregateValuesService !== null) {
      this.aggregateValues(this.selectedRows);
    }
  }

  addCollapsed(systemName: string) {
    if (this.collapsedRows === null) {
      this.collapsedRows = [];
    }
    const index = this.collapsedRows.findIndex(name => name === systemName);
    if (index > -1) {
      this.collapsedRows = this.collapsedRows.filter(name => name !== systemName);
    } else {
      this.collapsedRows.push(systemName);
    }
    this.localStorageService.set(this.options.storageNamePrefix + '_collapsed', this.collapsedRows);
  }

  isCollapsed(systemName: string): boolean {
    return this.collapsedRows.findIndex(value => value === systemName) > -1;
  }

  isColumnHighlighted(column: number) {
    if (!this.options.highlightColumn || this.isAggregatedValuesEmpty()) {
      return false;
    }
    return column === this.highlightedColumn;
  }

  setHighlightedColumn(column: number) {
    this.highlightColumnService.setHighlightColumn(column);
  }

  isAggregatedValuesEmpty() {
    return keys(this.aggregatedValues).length === 0;
  }

  onSelectRow(selectedRows: Array<SelectedRow>) {
    this.selectedRows = selectedRows;
    if (this.options.aggregateValuesService !== undefined && this.options.aggregateValuesService !== null) {
      this.aggregateValues(selectedRows);
    }
  }

  getAggregatedValue(type: string) {
    return this.aggregatedValues[type];
  }

  private aggregateValues(selectedRows: Array<SelectedRow>) {
    const mean = this.options.aggregateValuesService;
    const values = mean.computeSummaries([this.data], selectedRows, this.options);
    const result = {};
    if (values !== null) {
      this.options.getAggregatedColumns().forEach(
        column => result[column.index] = {
          value: values.getValue(<SystemMetricType>column.index).value,
          unit: values.getValue(<SystemMetricType>column.index).unit
        }
      );
    }
    this.data.aggregatedValues = values;
    this.aggregatedValues = result;
  }

  private summarizeAlerts() {
    this.initializeSummaryAlerts();
    this.options.cellDecoratorRules.forEach(
      rule => {
        const filteredData = this.data.rows.filter(
          row => {
            const cell = row.getCell(rule.type);
            return cell != null ? ConditionEvaluateUtils.eval(cell.value, rule) : false;
          }
        );
        if (filteredData.length > 0) {
          this.alertSummary.push(new AlertSummaryValue(rule.threshold.alertType, filteredData.length));
        }

      }
    );
  }

  private initializeSummaryAlerts() {
    this.options.cellDecoratorRules.forEach(
      rule => {
        this.alertSummary[rule.threshold.alertType] = 0;
      }
    );
  }
}
