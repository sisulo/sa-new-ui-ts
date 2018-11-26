import {Component, Input, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {Datacenter} from '../../models/Datacenter';
import {System} from '../../models/System';
import {SystemDetail} from '../../models/SystemDetail';

@Component({
  selector: 'app-tab',
  templateUrl: './performance-statistics.component.html',
  styleUrls: ['./performance-statistics.component.css']
})
export class PerformanceStatisticsComponent implements OnInit {
  dtOptions: DataTables.Settings[] = [];
  datacenters: Datacenter[];
  currentTab: string;
  data: SystemDetail[]; // Todo caching data by datacenters

  constructor(private metricService: MetricService) {
  }

  ngOnInit(): void {
    this.metricService.getDatacenters().subscribe(
      data => {
        this.datacenters = data.datacenters;
        this.currentTab = data.datacenters[0].id;
        this.data = this.getTableData(this.currentTab);
      }
    );
    this.dtOptions = {
      // @ts-ignore
      columns: [
        {title: 'System'},
        {title: 'Workload'},
        {title: 'Transfer'},
        {title: 'Response'},
        {title: 'CPU'},
        {title: 'HDD'},
        {title: 'Write Pending'}
      ],
      order: [1, 'desc'],
      paging: false,
      searching: false,
      info: false
    };
  }

  activeTab(id: string) {
    this.data = this.getTableData(id);
    this.currentTab = id;
  }

  getCurrentTab(): string {
    return this.currentTab;
  }

  getTableData(id: string): SystemDetail[] {
    this.metricService.getPerformanceStatistics(id).subscribe(
      data => {
        this.data = data.systems;
      }
    );
    return this.data;
  }




}
