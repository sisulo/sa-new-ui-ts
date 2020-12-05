import {StorageEntityType} from './owner.dto';

export class DuplicateStorageEntityDto {
  name: string;
  serialNumber: string;
  prefixReferenceId: string;
  types: string[];
}
