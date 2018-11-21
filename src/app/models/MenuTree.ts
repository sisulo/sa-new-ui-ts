import {MenuItem} from './MenuItem';

export class MenuTree {
  label: string;
  items: MenuItem[];

  constructor(label: string, items: MenuItem[]) {
    this.label = label;
    this.items = items;
  }
}
