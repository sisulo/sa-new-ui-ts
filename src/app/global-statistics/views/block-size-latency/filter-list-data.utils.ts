import {FilterListData} from './block-size-latency.component';

export class FilterListDataUtils {
  public static sort(data: FilterListData[]) {
    return data.sort(
      (itemA, itemB) => {
        if (isNaN(itemA.name.charCodeAt(Number('@')))) {
          return FilterListDataUtils.compare(itemA, itemB);
        } else {
          const splitA = itemA.name.split('@');
          const splitB = itemB.name.split('@');
          const compareResult = FilterListDataUtils.compare(splitA[0], splitB[0]);
          if (compareResult === 0) {
            return FilterListDataUtils.compare(splitA[1], splitB[1]);
          }
          return compareResult;
        }
      }
    );
  }

  private static compare(valueA, valueB) {
    if (valueA > valueB) {
      return 1;
    } else if (valueA === valueB) {
      return 0;
    }
    return -1;
  }
}
