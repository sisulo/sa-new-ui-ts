import {Owner} from './owner.dto';
import {ExternalResponseDto} from './external-response.dto';
import {StorageEntityDetailResponseDto} from './storage-entity-detail-response.dto';

export class StorageEntityResponseDto {
  storageEntity: Owner;
  externals: ExternalResponseDto[];
}
