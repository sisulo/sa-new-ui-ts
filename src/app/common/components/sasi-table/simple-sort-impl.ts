import {SasiColumn, SasiSortType} from './sasi-table.component';
import {Sort} from './sort';

export class SimpleSortImpl implements Sort {

  public sort(data, columns: SasiColumn[], sortType: SasiSortType, sortByRawValue: string, getValue: (row, column) => any) {
    const dataReturned = data.sort(
      (rowA, rowB) => {
        if (sortType === SasiSortType.ASC) {
          if (sortByRawValue !== null) {
            return this.compare(rowA.getCellRawData(columns[0])[sortByRawValue], rowB.getCellRawData(columns[0])[sortByRawValue]);
          } else {
            const compareColumn = columns.find(
              column => {
                return this.compare(getValue(rowA, column), getValue(rowB, column)) !== 0;
              }
            );
            return this.compare(getValue(rowA, compareColumn), getValue(rowB, compareColumn));
          }
        } else {
          if (sortByRawValue !== null) {
            return this.compare(rowB.getCellRawData(columns[0])[sortByRawValue], rowA.getCellRawData(columns[0])[sortByRawValue]);
          } else {
            const compareColumn = columns.find(
              column => {
                return this.compare(getValue(rowB, column), getValue(rowA, column)) !== 0;
              }
            );
            return this.compare(getValue(rowB, compareColumn), getValue(rowA, compareColumn));
          }
        }
      }
    );
    return dataReturned;
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
