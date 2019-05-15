import {Component, OnInit} from '@angular/core';
import {Datacenter} from '../common/models/Datacenter';
import {MetricService} from '../metric.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BusService} from './bus.service';
import {AdaptersComponent} from './adapters/adapters.component';
import {DpSlaComponent} from './dp-sla/dp-sla.component';
import {CapacityStatisticsComponent} from './capacity-statistics/capacity-statistics.component';
import {PerformanceStatisticsComponent} from './performance-statistics/performance-statistics.component';

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
      id => this.getDatacenters(id)

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
    // this.router.navigate(['/global-statistics/', id, this.context]);
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
}
