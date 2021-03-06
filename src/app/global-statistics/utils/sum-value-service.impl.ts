import {AggregatedValues, AggregateValueService} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SasiGroupRow, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {SystemMetricType} from '../../common/models/metrics/system-metric-type.enum';
import {SelectedRow} from '../../common/components/sasi-table/row-table/selected-row';
import {Metric} from '../../common/models/metrics/metric.vo';

class SumValue implements AggregatedValues {
  data = {};


  getValue(name: string): any {
    return this.data[name];
  }

  setMetric(type, value) {
    this.data[type] = value;
  }

  setValue(type, value, unit: string) {
    if (this.data[type] === undefined) {
      const metric = new Metric();
      metric.type = type;
      metric.unit = unit;
      metric.value = 0;
      this.setMetric(type, metric);
    }
    this.data[type].value += value;
  }
}

export class SumValueServiceImpl implements AggregateValueService { // Too many computes when first time loading adapter stats
  computeSummaries(inputRowGroup: SasiGroupRow[], filter: Array<SelectedRow>, options: SasiTableOptions): AggregatedValues {
    const aggregatedValues = new SumValue();
    options.getAggregatedColumns().forEach(
      column => {
        const value = inputRowGroup[0].rows.map(
          (row) => {
            return row.getCellValue(column);
          }
        ).reduce(
          (valueA, valueB) => valueA + valueB, 0
        );
        aggregatedValues.setValue(<SystemMetricType>column.index, value, null);
      }
    );
    return aggregatedValues;
  }

}
