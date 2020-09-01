import {Sort} from './sort';
import {SasiColumn, SasiGroupRow, SasiSortType} from './sasi-table.component';
import {SimpleSortImpl} from './simple-sort-impl';

export class GroupSortAggregateValueImpl extends SimpleSortImpl implements Sort {
  sort(data: SasiGroupRow[], columns: SasiColumn[], sortType: SasiSortType, sortByRawValue: string) {
    data.forEach(
      groupRow => groupRow.rows = super.sort(
        groupRow.rows,
        columns,
        sortType,
        sortByRawValue,
        (row, columnIndex) => {
          if (row !== undefined) {
            return row.getCellValue(columnIndex);
          }
          return null;
        })
    );
    if (columns.find(column => column.index === 'name') || columns.find(column => column.index === 'sortId')) {
      return super.sort(data, columns, sortType, sortByRawValue, (row, columnIndex) => {
        if (row !== undefined) {
          return row.groupRow.getCellValue(columnIndex);
        }
        return null;
      });
    } else {
      return super.sort(data, columns, sortType, sortByRawValue, (row, columnIndex) => {
        if (row !== undefined && row.rows[0] !== undefined) {
          return row.aggregatedValues.getValue(columnIndex.index).value;
        }
        return null;
      });

    }
  }

}
