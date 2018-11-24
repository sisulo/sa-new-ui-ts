import {Component, OnInit} from '@angular/core';
import {MetricService} from '../metric.service';
import {InfraMetric} from '../models/metrics/InfraMetric';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private metricService: MetricService) {
  }

  metrics: InfraMetric[] = [];
  datacenters;
  registeredSystems;
  colors = ['#a09608', '#38a008', '#08a09d', '#421570', '#f56954'];
  currentColor = 0;

  ngOnInit() {
    this.metricService.getInfrastructureStats().subscribe(stats => {
      this.metrics = stats.metrics;
      this.datacenters = stats.datacentersCount;
      this.registeredSystems = stats.registeredSystemsCount;
    });
    this.getMap();
  }

  getColor(): string {
    this.currentColor += 1;
    return this.colors[this.currentColor % this.colors.length];
  }

  getMap(): void {
    $(function(){
      $('#world-map-markers').vectorMap({
        map: 'world_mill_en',
        scaleColors: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial',
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
          initial: {
            fill: '#F8E23B',
            stroke: '#383f47',
          }
        },
        markerLabelStyle : {
          initial: {
            display: 'inline'
          }
        },

        backgroundColor: '#3c8dbc',

        markers: [
          {latLng: [50.05, 14.48], name: 'CZ_Sitel'},
          {latLng: [50.07, 14.44], name: 'CZ_Chodov'},
          {latLng: [2.9, 101.65], name: 'MY_Cyberjaja'},
          {latLng: [3.14, 101.70], name: 'MY_AIMS'},
          {latLng: [39.04, -77.48], name: 'US_Ashburn'},
          {latLng: [40.21, -77.00], name: 'US_Mechanigsburg'},
        ]
      });

    });

  }
}
