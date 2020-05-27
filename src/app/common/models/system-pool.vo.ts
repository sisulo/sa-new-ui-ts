import {SystemDetail} from './system-detail.vo';

export class SystemPool {
  id: number;
  name: string;
  children: SystemDetail[];
}
