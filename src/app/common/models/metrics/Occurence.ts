import {EntityType} from './EntityType';

export class Occurence {
  datacenterId: number;
  systemId: number;
  entityId: number;
  entityType: EntityType;
  name: string;
  value: number;
  unit: string;
  average: number;
}
