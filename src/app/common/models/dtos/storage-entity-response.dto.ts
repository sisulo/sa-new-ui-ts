import {Owner} from './owner.dto';
import {ExternalResponseDto} from './external-response.dto';

export class StorageEntityResponseDto {
  storageEntity: Owner;
  externals: ExternalResponseDto[];
}
