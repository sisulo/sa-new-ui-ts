import {Sort} from './sort';
import {SasiColumn, SasiGroupRow, SasiSortType} from './sasi-table.component';
import {SimpleSortImpl} from './simple-sort-impl';

export class GroupSortImpl extends SimpleSortImpl implements Sort {
  sort(data: SasiGroupRow[], column: SasiColumn, sortType: SasiSortType, sortByRawValue: string) {
    data.forEach(
      groupRow => groupRow.rows = super.sort(
        groupRow.rows,
        column,
        sortType,
        sortByRawValue,
        (row, columnIndex) => {
          if (row !== undefined) {
            return row.getCellValue(columnIndex);
          }
          return null;
        })
    );
    if (column.index === 'name') {
      return super.sort(data, column, sortType, sortByRawValue, (row, columnIndex) => {
        if (row !== undefined) {
          return row.groupRow.getCellValue(columnIndex);
        }
        return null;
      });
    } else {
      return super.sort(data, column, sortType, sortByRawValue, (row, columnIndex) => {
        if (row !== undefined && row.rows[0] !== undefined) {
          return row.rows[0].getCellValue(columnIndex);
        }
        return null;
      });

    }
  }

}
