import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Datacenter} from '../common/models/datacenter.vo';
import {MetricService} from '../metric.service';
import {BusService} from './bus.service';


@Component({
  selector: 'app-global-statistics',
  templateUrl: './global-statistics.component.html',
  styleUrls: ['./global-statistics.component.css'],
})
export class GlobalStatisticsComponent implements OnInit {

  dataCenters: Datacenter[] = [];
  currentTab: number;
  context: string;

  constructor(
    private metricService: MetricService,
    private bus: BusService,
  ) {
  }

  ngOnInit(): void {
    this.bus.datacenterAnnouncement$.subscribe(
      id => this.getDataCenters(id)
    );
    this.bus.contextAnnouncement$.subscribe(
      context => {
        setTimeout(() => // setTimeout is small hack because off View checking for changes
          this.context = context
        );

      }
    );
  }

  activeTab(id: number) {
    this.currentTab = id;
  }

  isCurrentTab(id: number): boolean {
    return id === this.currentTab;
  }

  getDataCenters(currentTab: number) {
    this.metricService.getDataCenters().subscribe(
      data => {
        this.dataCenters = [];
        const defaultDatacenter = new Datacenter();
        defaultDatacenter.label = 'All';
        defaultDatacenter.id = -1;
        this.dataCenters.push(defaultDatacenter);
        this.dataCenters = [...this.dataCenters, ...data.map(Datacenter.of)];
        this.currentTab = currentTab;
      }
    );
  }

  getTitle() {
    switch (this.context) {
      case 'performance':
        return 'Performance Statistics';
      case 'physical-capacity':
        return 'Physical Capacity';
      case 'logical-capacity':
        return 'Logical capacity';
      case 'host-group-capacity':
        return 'VMware Capacity';
      case 'dp-sla':
        return 'SLA Events';
      case 'adapters':
        return 'CHA&Port Imbalances';
      default:
        return 'Statistics';
    }
  }

  getTabTitle() {
    switch (this.context) {
      case 'physical-capacity':
        return 'Physical Capacity by Datacenter';
      case 'logical-capacity':
        return 'Logical Capacity by Datacenter';
      case 'host-group-capacity':
        return 'VMware Capacity by Datacenter';
    }
  }
}
