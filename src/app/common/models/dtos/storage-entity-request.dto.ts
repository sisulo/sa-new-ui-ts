import {StorageEntityType} from './owner.dto';

export class StorageEntityRequestDto {
  name: string;
  serialNumber: string;
  type: StorageEntityType;
  parentId: number;
}
