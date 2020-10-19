import {SasiColumn, SasiSortType} from './sasi-table.component';
import {Sort} from './sort';

export class SimpleSortImpl implements Sort {

  private groupSortingWithSubRow = false;

  constructor(groupSortingWithSubRow: boolean = false) {
    this.groupSortingWithSubRow = groupSortingWithSubRow;
  }

  public sort(data, columns: SasiColumn[], sortType: SasiSortType, sortByRawValue: string, getValue: (row, column, sortByRawVaue) => any) {
    return data.sort(
      (rowA, rowB) => {
        if (sortType === SasiSortType.ASC) {
          return this.compareRow(sortByRawValue, rowA, columns, rowB, getValue);
        } else {
          return this.compareRow(sortByRawValue, rowB, columns, rowA, getValue);
        }
      }
    );
  }

  private compareRow(sortByRawValue: string, rowA, columns: SasiColumn[], rowB, getValue: (row, column, altSort) => any) {
    // if (sortByRawValue !== null) {
    //   return this.compareCells(rowA, rowB, columns[0], sortByRawValue, getValue);
    // } else {
      const compareColumn = columns.find(
        column => {
          return this.compareCells(rowA, rowB, column, sortByRawValue, getValue) !== 0;
        }
      );
      if (compareColumn === undefined) {
        return 0;
      }
      return this.compareCells(rowA, rowB, compareColumn, sortByRawValue, getValue);
    // }
  }

  private compareCells(rowA, rowB, column: SasiColumn, sortByRawValue: string, getValue: (row, column, altSort) => any) {
    if (['name', 'sortId'].includes(column.index) && rowA.groupRow !== undefined && !this.groupSortingWithSubRow) {
      getValue = (row, columnIndex) => {
        if (row !== undefined) {
          return row.groupRow.getCellValue(columnIndex);
        }
        return null;
      };
    }
    return this.compare(getValue(rowA, column, sortByRawValue), getValue(rowB, column, sortByRawValue));
  }

  compare(valueA, valueB) {
    const a = valueA || '';
    const b = valueB || '';

    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
    return 0;
  }

}
