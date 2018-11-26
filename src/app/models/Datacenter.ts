import {System} from './System';

export class Datacenter {
  id: string;
  label: string;
  systems: System[];
  latitude: number;
  longitude: number;
}
