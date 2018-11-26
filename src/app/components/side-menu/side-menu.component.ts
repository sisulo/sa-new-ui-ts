import {Component, OnInit} from '@angular/core';
import {MenuTree} from '../../models/MenuTree';
import {environment} from '../../../environments/environment';
import {MetricService} from '../../metric.service';
import {Datacenter} from '../../models/Datacenter';
import {MenuItem} from '../../models/MenuItem';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  items: MenuTree[];
  filteredItems: MenuTree[];
  searchExpression: string;
  activeLink = [];
  poolMetricLinks = [
    {id: 1, linkPart: '1%20Dash%20Board/Dash%20Board.html', name: 'Dashboard'},
    {id: 2, linkPart: '2%20Server%20Board/index.html', name: 'Server board'},
    {id: 3, linkPart: '4%20DP%20Pool%20Board%20and%20SLA/index.html', name: 'DP Pool Board and SLA'},
    {id: 4, linkPart: '7%20Deep%20Analysis/index.html', name: 'Deep Analysis'},
    {id: 5, linkPart: '8%20Cache%20Board/index.html', name: 'Cache Board'},
    {id: 6, linkPart: '8%20CHA%20Adapters%20Board/index.html', name: 'CHA Adapters Board'},
    {id: 7, linkPart: '8%20Trends/Trends.html', name: 'Trends'}
  ];
  globalStatisticsLinks = [
    {id: 1, linkPart: '001%20Performance%20Statistics/index.html', name: 'Performance Statistics'},
    {id: 2, linkPart: '002%20Capacity%20Statistics/Capacity%20Statistics.html', name: 'Capacity Statistics'}
  ];

  constructor(private metricService: MetricService) {
  }

  ngOnInit() {
    this.metricService.getDatacenters().subscribe(data => {
      this.items = this.convertMenu(data.datacenters);
      this.filteredItems = this.items;
    });
  }

  search(): void {
    if (this.searchExpression === '') {
      this.filteredItems = this.items;
      return;
    }
    let filteredTree = null;
    this.filteredItems = [];
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

  getPoolMetricLink(systemId: number, linkPart: string) {
    const systemPrefix = systemId.toString().length === 1 ? '0' + systemId : systemId;
    return this.hrefEncode(environment.iframeBaseUrl + systemPrefix + linkPart);
  }

  isHighlighted(poolId: string, linkId: string): boolean {
    if (this.activeLink.length === 0) {
      return false;
    }
    if (poolId === this.activeLink[0] && this.activeLink[1] === linkId) {
      return true;
    }
    return false;
  }

  highlight(poolId: string, linkId: string): void {
    this.activeLink = [poolId, linkId];
  }

  private convertMenu(data: Datacenter[]): MenuTree[] {
    const menu: MenuTree[] = [];
    for (const datacenter of data) {
      const items: MenuItem[] = [];
      for (const system of datacenter.systems) {
        items.push(new MenuItem(system.id, system.name));
      }
      menu.push(new MenuTree(datacenter.label, items));
    }
    return menu;
  }
}

