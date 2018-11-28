import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../../metric.service';
import {SystemDetail} from '../../../models/SystemDetail';
import {ActivatedRoute, Router} from '@angular/router';
import {BusService} from '../bus.service';
import {SystemMetric} from '../../../models/metrics/SystemMetric';

@Component({
  selector: 'app-tab',
  templateUrl: './performance-statistics.component.html',
  styleUrls: ['./performance-statistics.component.css']
})
export class PerformanceStatisticsComponent implements OnInit {
  data: SystemDetail[] = []; // Todo caching data by datacenters
  tableData = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private bus: BusService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      params => {
        let id = +params.get('id');
        if (id === 0) {
          id = 1;
        }
        console.log('PS ' + id);
        this.data = this.getTableData(id);
        this.bus.announceDatacenter(id);
      }
    );
    this.bus.datacenterAnnouncement$.subscribe(
      id => {
        this.data = this.getTableData(id);
      }
    );

  }


  getTableData(id: number): SystemDetail[] {
    this.metricService.getPerformanceStatistics(id).subscribe(
      data => {
        this.data = data.systems;
        this.tableData = this.data.map(system => this.convertToTableData(system));
        console.log(this.tableData);
      },
      error => {
        console.log(error);
        this.data = [];
      }
    );
    return this.data;
  }


  convertToTableData(rawData: SystemDetail): {} {
    const result = {};
    for (const metric of rawData.metrics) {
      result[metric.name.toLowerCase().replace(' ', '_')] = metric.value;
    }
    result['name'] = rawData.name;
    return result;
  }

  getMetricObject(systemName: string, metricName: string): SystemMetric {
    return this.data
      .find(system => system.name === systemName).metrics
      .find(data => {
          return data.name === metricName;
        }
      );
  }
}
