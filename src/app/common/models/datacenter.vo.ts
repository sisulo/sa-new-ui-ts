import {System} from './system.vo';

export class Datacenter {
  id: number;
  label: string;
  systems: System[];
  latitude: number;
  longitude: number;
}
