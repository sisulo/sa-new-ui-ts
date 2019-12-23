import {SystemPool} from '../system-pool.vo';

export class CapacityStatisticsDto {
  id: number;
  name: string;
  systems: SystemPool[];
}
