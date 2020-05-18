import {System} from './system.vo';
import {StorageEntityResponseDto} from './dtos/storage-entity-response.dto';

export class Datacenter {
  id: number;
  label: string;
  systems: System[];
  latitude: number;
  longitude: number;

  static of(dto: StorageEntityResponseDto) {
    const dc = new Datacenter();
    dc.label = dto.storageEntity.name;
    dc.id = dto.storageEntity.id;
    return dc;
  }
}
