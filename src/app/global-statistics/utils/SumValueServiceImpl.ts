import {AggregatedValues, AggregateValueService} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SasiGroupRow, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {SelectedRow} from '../../common/components/sasi-table/row-table/row-table.component';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';

class SumValue implements AggregatedValues {
  data = {};

  setValue(name: SystemMetricType, value: number) {
    this.data[name] = value;
  }

  getValue(name: string): number {
    return this.data[name];
  }

}

export class SumValueServiceImpl implements AggregateValueService {
  computeSummaries(inputRowGroup: SasiGroupRow[], filter: Array<SelectedRow>, options: SasiTableOptions): AggregatedValues {
    const aggregatedValues = new SumValue();
    options.getAggregatedColumns().forEach(
      column => {
        const value = inputRowGroup[0].rows.map(
          (row) => {
            return row.getCellValue(column);
          }
        ).reduce(
          (valueA, valueB) => valueA + valueB
        );
        aggregatedValues.setValue(<SystemMetricType> column.index, value);
      }
    );
    return aggregatedValues;
  }

}
