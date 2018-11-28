import {System} from './System';

export class Datacenter {
  id: number;
  label: string;
  systems: System[];
  latitude: number;
  longitude: number;
}
