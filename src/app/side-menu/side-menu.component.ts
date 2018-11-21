import {Component, OnInit} from '@angular/core';
import {MenuService} from '../menu.service';
import {MenuItem} from '../models/MenuItem';
import {MenuTree} from '../models/MenuTree';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  items: MenuTree[];
  filteredItems: MenuTree[];
  searchExpression: string;
  private activated: ActiveLink = null;

  constructor(private menuService: MenuService) {
  }

  ngOnInit() {
    this.menuService.getData().subscribe(menu => {
      this.items = menu.items;
      this.filteredItems = menu.items;
    });
    this.filteredItems = this.items;
  }

  search(): void {
    if (this.searchExpression === '') {
      this.filteredItems = this.items;
      return;
    }
    let filteredTree = null;
    this.filteredItems = [];
    // console.log(this.searchExpression);
    for (const tree of this.items) {
      for (const item of tree.items) {
        if (item.name.indexOf(this.searchExpression) > -1) {
          if (filteredTree === null) {
            filteredTree = new MenuTree(tree.label, []);
          }
          filteredTree.items.push(item);
        }
      }
      if (filteredTree !== null) {
        this.filteredItems.push(filteredTree);
      }
      filteredTree = null;
    }
  }

  hrefEncode(url: string): string {
    return '/iframe/' + btoa(url);
  }

  activate(id: String, linkNumber: number): void {
    this.activated = new ActiveLink(id, linkNumber);
  }

  isActiveLink(id, linkNumber): boolean {
    if (this.activated === null) {
      return false;
    }
    if (this.activated.id === id && this.activated.linkNumber === linkNumber) {
      return true;
    }
    return false;
  }
}

class ActiveLink {
  id: String;
  linkNumber: number;
  constructor(id: String, linkNumber: number) {
    this.id = id;
    this.linkNumber = linkNumber;
  }
}
