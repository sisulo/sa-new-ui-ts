import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {StorageEntityResponseDto} from '../../common/models/dtos/storage-entity-response.dto';

export class ExtractStorageEntityUtils {
  public static extractByType(data: StorageEntityResponseDto[], type: StorageEntityType) {
    const storageEntities = [];
    data.forEach(
      dc => storageEntities.push(...ExtractStorageEntityUtils.extractStorageEntity(dc.storageEntity.children, type))
    );
    return storageEntities;
  }

  private static extractStorageEntity(owners: Owner[], type): Owner[] {
    if (owners !== undefined && owners.length > 0) {
      if (owners[0].type === StorageEntityType[type]) {
        return owners;
      } else {
        const result: any[] = [];
        return owners.reduce((acc, current) => {
          acc.push(...ExtractStorageEntityUtils.extractStorageEntity(current.children, type));
          console.log(acc);
          return acc;
        }, result);
      }
    }
    return [];
  }
}
