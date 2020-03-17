import {FilterListData} from './block-size-latency.component';

export enum SortType {
  ASC,
  DESC
}

export class FilterListDataUtils {
  public static sort(data: FilterListData[], type: SortType) {
    return data.sort(
      (itemA, itemB) => {
        if (isNaN(itemA.name.charCodeAt(Number('@')))) {
          return FilterListDataUtils.compare(itemA, itemB, type);
        } else {
          const splitA = itemA.name.split('@');
          const splitB = itemB.name.split('@');
          const compareResult = FilterListDataUtils.compare(splitA[0], splitB[0], type);
          if (compareResult === 0) {
            return FilterListDataUtils.compare(splitA[1], splitB[1], type);
          }
          return compareResult;
        }
      }
    );
  }

  private static compare(valueA, valueB, type: SortType) {
    if (type === SortType.ASC) {
      if (valueA > valueB) {
        return 1;
      } else if (valueA === valueB) {
        return 0;
      }
      return -1;
    } else {
      if (valueA > valueB) {
        return -1;
      } else if (valueA === valueB) {
        return 0;
      }
      return 1;
    }
  }
}
