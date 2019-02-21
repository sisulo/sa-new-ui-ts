import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {Metric} from '../../common/models/metrics/Metric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {Alert} from '../../common/models/metrics/Alert';
import {AlertType} from '../../common/models/metrics/AlertType';

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
  metricLabels = {};
  alertLabels = {};
  metrics: Metric[] = [];
  alerts: Alert[] = [];
  alertIcons = {};
  metricIcons = {};
  metricColor = {};
  datacenters;
  registeredSystems;
  colors = ['#a09608', '#38a008', '#08a09d', '#421570', '#f56954'];
  currentColor = 0;

  ngOnInit() {
    this.metricLabels[SystemMetricType.WORKLOAD] = 'Total Workload';
    this.metricLabels[SystemMetricType.TRANSFER] = 'Total Transfer';

    this.alertLabels[AlertType.CAPACITY_USAGE] = 'Capacity usage';
    this.alertLabels[AlertType.CPU] = 'CPU';
    this.alertLabels[AlertType.DISBALANCE_EVENTS] = 'Disbalance events';
    this.alertLabels[AlertType.HDD] = 'HDD';
    this.alertLabels[AlertType.RESPONSE] = 'Response';
    this.alertLabels[AlertType.SLA_EVENTS] = 'SLA events';
    this.alertLabels[AlertType.WRITE_PENDING] = 'Write pending';

    this.alertIcons[AlertType.CAPACITY_USAGE] = 'fa-pie-chart';
    this.alertIcons[AlertType.CPU] = 'fa-dashboard';
    this.alertIcons[AlertType.DISBALANCE_EVENTS] = 'fa-random';
    this.alertIcons[AlertType.HDD] = 'fa-hdd-o';
    this.alertIcons[AlertType.RESPONSE] = 'fa-line-chart';
    this.alertIcons[AlertType.SLA_EVENTS] = 'fa-bell-o';
    this.alertIcons[AlertType.WRITE_PENDING] = 'fa-bar-chart';

    this.metricIcons[SystemMetricType.WORKLOAD] = 'fa fa-chart-bar';
    this.metricIcons[SystemMetricType.TRANSFER] = 'fa fa-exchange';

    this.metricColor[SystemMetricType.WORKLOAD] = 'bg-maroon';
    this.metricColor[SystemMetricType.TRANSFER] = 'bg-primary';

    this.metricService.getInfrastructureStats().subscribe(stats => {
      this.metrics = stats.metrics;
      this.alerts = stats.alerts;
    });
    this.metricService.getDatacenters().subscribe(
      data => {
        this.datacenters = data.datacenters.length;
        this.registeredSystems = data.datacenters.reduce((previousValue, currentValue) => {
          return previousValue + currentValue.systems.length;
        }, 0);
      }
    );
    this.getMap();
  }

  getAlertIcon(type: SystemMetricType) {
    return this.alertIcons[type];
  }

  getMetricIcon(type: SystemMetricType) {
    return this.metricIcons[type];
  }
  getMetricLabel(type: SystemMetricType) {
      return this.metricLabels[type];
  }

  getMetricColor(type: SystemMetricType) {
    return this.metricColor[type];
  }

  getAlertLabel(type: AlertType) {
    return this.alertLabels[type];
  }
  getColor(colorIndex): string {
    this.currentColor += 1;
    return this.colors[colorIndex % this.colors.length];
  }

  getMap(): void {
    $(function () {
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
        markerLabelStyle: {
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
