import {Component, OnInit} from '@angular/core';
import {MenuTree} from '../../common/models/menu-tree.vo';
import {MetricService} from '../../metric.service';
import {MenuItem} from '../../common/models/menu-item.vo';
import {StorageEntityResponseDto} from '../../common/models/dtos/storage-entity-response.dto';
import {SortStorageEntity} from '../../common/utils/sort-storage-entity';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {

  items: MenuTree[];
  filteredItems: MenuTree[];
  searchExpression: string;
  poolMetricLinks = [
    {id: 1, linkPart: 'dashboard', name: 'Dashboard'},
    {id: 2, linkPart: 'serverBoard', name: 'Server board'},
    {id: 3, linkPart: 'dpSla', name: 'DP Pool Board and SLA'},
    {id: 4, linkPart: 'deepAnalysis', name: 'Deep Analysis'},
    {id: 5, linkPart: 'cache', name: 'Cache Board'},
    {id: 6, linkPart: 'adapters', name: 'CHA Adapters Board'},
    {id: 7, linkPart: 'trends', name: 'Trends'},
    {id: 8, linkPart: 'capacityAnalysis', name: 'Capacity Analysis'}
  ];
  globalStatisticsLinks = [];
  storageConfigurationLinks = [];
  private defaultDataCenter: number;

  constructor(private metricService: MetricService) {
  }

  ngOnInit() {
    this.metricService.getDataCenters().subscribe(data => {
      this.items = this.convertMenu(data);
      this.setDefaultDataCenter(data);
      this.filteredItems = this.items;
    });
  }

  private setDefaultDataCenter(dataCenters: StorageEntityResponseDto[]) {
    if (dataCenters.length > 0) {
      this.defaultDataCenter = dataCenters[0].storageEntity.id;
      this.setGlobalStatisticsLinks();
      this.setSystemConfigurationLinks();
    }
  }

  private setGlobalStatisticsLinks() {
    this.globalStatisticsLinks = [
      {id: 1, linkPart: `/global-statistics/performance`, name: 'Performance Statistics'},
      {id: 2, linkPart: `/global-statistics/physical-capacity`, name: 'Physical Capacity'},
      {id: 3, linkPart: `/global-statistics/logical-capacity`, name: 'Logical Capacity'},
      {id: 4, linkPart: `/global-statistics/dp-sla`, name: 'SLA Events'},
      {id: 5, linkPart: `/global-statistics/adapters`, name: 'CHA&Port Imbalances'},
      {id: 6, linkPart: `/global-statistics/host-group-capacity`, name: 'VMware Capacity'},
      {id: 7, linkPart: `/global-statistics/latency`, name: 'Latency Analysis'},
    ];
  }

  private setSystemConfigurationLinks() {
    this.storageConfigurationLinks = [
      {id: 1, linkPart: `/storage-config/locations`, name: 'Systems by locations'},
    ];
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

  private convertMenu(data: StorageEntityResponseDto[]): MenuTree[] {
    const menu: MenuTree[] = [];
    console.log(data);
    const sortedData = SortStorageEntity.sort(data);
    console.log(sortedData);
    for (const dataCenter of sortedData) {
      const items: MenuItem[] = [];
      for (const system of dataCenter.storageEntity.children) {
        items.push(new MenuItem(system.id, system.name));
      }
      menu.push(new MenuTree(dataCenter.storageEntity.name, items));
    }
    return menu;
  }
}

