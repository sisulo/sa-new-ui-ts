import {SasiColumn, SasiSortType} from './sasi-table.component';
import {Sort} from './sort';

export class SimpleSortImpl implements Sort {

  public sort(data, column: SasiColumn, sortType: SasiSortType, sortByRawValue: string, getValue: (row, column) => any) {
    const dataReturned = data.sort(
      (rowA, rowB) => {
        if (sortType === SasiSortType.ASC) {
          if (sortByRawValue !== null) {
            return this.compare(rowA.getCellRawData(column)[sortByRawValue], rowB.getCellRawData(column)[sortByRawValue]);
          } else {
            return this.compare(getValue(rowA, column), getValue(rowB, column));
          }
        } else {
          if (sortByRawValue !== null) {
            return this.compare(rowB.getCellRawData(column)[sortByRawValue], rowA.getCellRawData(column)[sortByRawValue]);
          } else {
            return this.compare(getValue(rowB, column), getValue(rowA, column));
          }
        }
      }
    );
    return dataReturned;
  }

  compare(valueA, valueB) {
    if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    }
    return 0;
  }
}
