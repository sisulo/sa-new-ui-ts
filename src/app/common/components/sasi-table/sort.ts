import {SasiColumn, SasiSortType} from './sasi-table.component';

export interface Sort {
  sort(data, column: SasiColumn, sortType: SasiSortType, sortByRawValue: string, getValue: (row, column) => any);
}
