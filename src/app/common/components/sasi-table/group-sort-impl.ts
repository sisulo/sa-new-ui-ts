import {Sort} from './sort';
import {SasiColumn, SasiGroupRow, SasiSortType} from './sasi-table.component';
import {SimpleSortImpl} from './simple-sort-impl';

export class GroupSortImpl extends SimpleSortImpl implements Sort {
  sort(data: SasiGroupRow[], column: SasiColumn, sortType: SasiSortType, sortByRawValue: string) {
    data.forEach(
      groupRow => groupRow.rows = super.sort(groupRow.rows, column, sortType, sortByRawValue, (row, columnIndex) => row.getCellValue(columnIndex))
    );
    const result = super.sort(data, column, sortType, sortByRawValue, (row, columnIndex) => row.rows[0].getCellValue(columnIndex));
    return result;
  }

}
