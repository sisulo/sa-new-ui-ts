export enum StorageEntityType {
  DATA_CENTER = 1,
  SYSTEM,
  POOL,
  ADAPTER,
  PORT,
  HOST_GROUP,
}

export class Owner {
  id: number;
  name: string;
  type: string;
  status: string;
  serialNumber: string;
  parent: Owner;
  children: Owner[];
}
