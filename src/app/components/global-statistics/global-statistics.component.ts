import {Component, OnInit} from '@angular/core';
import {Datacenter} from '../../models/Datacenter';
import {MetricService} from '../../metric.service';
import {ActivatedRoute} from '@angular/router';
import {BusService} from './bus.service';

@Component({
  selector: 'app-global-statistics',
  templateUrl: './global-statistics.component.html',
  styleUrls: ['./global-statistics.component.css']
})
export class GlobalStatisticsComponent implements OnInit {

  datacenters: Datacenter[];
  currentTab: number;

  constructor(
    private metricService: MetricService,
    private bus: BusService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.bus.datacenterAnnouncement$.subscribe(
      id => {
        this.getDatacenters(id);
      }
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
        this.datacenters = data.datacenters;
        this.currentTab = currentTab;
      }
    );
  }
}
