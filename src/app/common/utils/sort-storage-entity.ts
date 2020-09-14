import {StorageEntityResponseDto} from '../models/dtos/storage-entity-response.dto';
import {SortType} from '../../global-statistics/views/block-size-latency/filter-list-data.utils';
import {Owner} from '../models/dtos/owner.dto';

export class SortStorageEntity {
  public static sort(data: StorageEntityResponseDto[], sortType: SortType = SortType.ASC): StorageEntityResponseDto[] {
    data.forEach(
      datacenter => {
        datacenter.storageEntity.children =
          SortStorageEntity.simpleSort(datacenter.storageEntity.children,
            (value) => value.detail.sortId,
            (value) => value.name) as Owner[];
      }
    );
    return this.simpleSort(data,
      (value) => value.storageEntity.children[0].detail.sortId,
      (value) => value.storageEntity.children[0].name) as StorageEntityResponseDto[];
  }

  public static simpleSort(systems: Owner[] | StorageEntityResponseDto[], getValue: (Owner) => number, getName: (Owner) => string) {
    return systems.sort((systemA, systemB) => {
        const sortValue = SortStorageEntity.compare(getValue(systemA), getValue(systemB));
        if (sortValue === 0) {
          return SortStorageEntity.compare(getName(systemA), getName(systemB));
        }
        return sortValue;
      }
    );
  }

  private static compare(valueA, valueB) {
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
