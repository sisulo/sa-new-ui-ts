import {Component, OnInit} from '@angular/core';
import {Datacenter} from '../common/models/Datacenter';
import {MetricService} from '../metric.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BusService} from './bus.service';
import {CapacityStatisticsComponent} from './capacity-statistics/capacity-statistics.component';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';
import {DpSlaComponent} from './dp-sla/dp-sla.component';
import {AdaptersComponent} from './adapters/adapters.component';

@Component({
  selector: 'app-global-statistics',
  templateUrl: './global-statistics.component.html',
  styleUrls: ['./global-statistics.component.css']
})
export class GlobalStatisticsComponent implements OnInit {

  dataCenters: Datacenter[];
  currentTab: number;
  context: string;

  constructor(
    private metricService: MetricService,
    private bus: BusService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.bus.datacenterAnnouncement$.subscribe(
      id => {
        this.getDatacenters(id);
      }
    );
    this.route.url.subscribe(
      url => this.loadContext()
    );
  }

  activeTab(id: number) {
    this.currentTab = id;
    this.bus.announceTab(id);
  }

  isCurrentTab(id: number): boolean {
    return id === this.currentTab;
  }

  getDatacenters(currentTab: number) {
    this.metricService.getDatacenters().subscribe(
      data => {
        this.dataCenters = data.datacenters;
        this.currentTab = currentTab;
      }
    );
  }

  private loadContext() {
    if (this.route.children.length > 0) {
      const childComponent = this.route.children[0].component;
      let componentName = '';
      if (typeof childComponent !== 'string') {
        componentName = childComponent.name;
      }
      switch (componentName) {
        case CapacityStatisticsComponent.name:
          this.context = 'capacity';
          break;
        case PerformanceStatisticsComponent.name:
          this.context = 'performance';
          break;
        case DpSlaComponent.name:
          this.context = 'dpSla';
          break;
        case AdaptersComponent.name:
          this.context = 'adapters';
          break;
        default:
          throw new Error('Unknown context');
      }
    }
  }
}
