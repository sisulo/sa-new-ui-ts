import {StorageEntityDetailResponseDto} from './storage-entity-detail-response.dto';

export enum StorageEntityType {
  DATACENTER = 1,
  SYSTEM,
  POOL,
  ADAPTER_GROUP,
  PORT_GROUP,
  HOST_GROUP,
  PARITY_GROUP,
  PORT,
  CHANNEL_BOARD,
  DKC,
  CONTROLLER
}

export class Owner {
  id: number;
  name: string;
  type: string;
  status: string;
  serialNumber: string;
  parent: Owner;
  children: Owner[];
  detail: StorageEntityDetailResponseDto;
}
