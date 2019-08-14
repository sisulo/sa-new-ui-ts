import {Component, OnInit} from '@angular/core';
import {Datacenter} from '../common/models/Datacenter';
import {MetricService} from '../metric.service';
import {BusService} from './bus.service';

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
