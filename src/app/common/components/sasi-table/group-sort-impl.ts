import {Sort} from './sort';
import {SasiColumn, SasiGroupRow, SasiSortType} from './sasi-table.component';
import {SimpleSortImpl} from './simple-sort-impl';

export class GroupSortImpl extends SimpleSortImpl implements Sort {

  constructor(groupSortingWithSubRow = false) {
    super(groupSortingWithSubRow);
  }

  sort(data: SasiGroupRow[], columns: SasiColumn[], sortType: SasiSortType, sortByRawValue: string) {
    data.forEach(
      groupRow => groupRow.rows = super.sort(
        groupRow.rows,
        columns,
        sortType,
        sortByRawValue,
        (row, columnIndex, altSort) => {
          if (row !== undefined) {
            if (altSort !== undefined && altSort != null) {
              return row.getCellRawData(columnIndex)[altSort];
            }
            return row.getCellValue(columnIndex);
          }
          return null;
        })
    );

    return super.sort(data, columns, sortType, sortByRawValue, (row, columnIndex, altSort) => {
      if (row !== undefined && row.rows[0] !== undefined) {
        if (altSort !== undefined && altSort !== null) {
          return row.rows[0].getCellRawData(columnIndex)[altSort];
        }
        return row.rows[0].getCellValue(columnIndex);
      }
      return null;
    });
  }

}
