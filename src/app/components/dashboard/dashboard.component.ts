import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {Metric} from '../../common/models/metrics/Metric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {Alert} from '../../common/models/metrics/Alert';
import {AlertType} from '../../common/models/metrics/AlertType';
import {FormatThousandsPipe} from '../../common/utils/format-thousands.pipe';
import {RegionMetricDto} from '../../common/models/dtos/region-metric.dto';
import {Region} from '../../common/models/dtos/region.enum';
import {StorageConvertPipe} from '../../common/storage-convert.pipe';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  metricLabels = {};
  alertLabels = {};
  metrics: RegionMetricDto[] = [];
  alerts: Alert[] = [];
  alertsPerformance = [];
  alertsOperations = [];
  alertIcons = {};
  metricIcons = {};
  metricColor = {};
  linkContext = {};
  datacenters: Metric;
  registeredSystems: Metric;
  colors = ['#a09608', '#38a008', '#08a09d', '#421570', '#f56954'];
  currentColor = 0;
  chart = {type: 'area', height: '300'};
  xaxis = {type: 'datetime', labels: {format: 'yyyy-MM-dd'}};
  fill = ['#337ab7', '#d81b60'];
  yaxis = [
    {
      seriesName: 'Transfer',
      labels: {
        formatter: function (value) {
          const pipe = new FormatThousandsPipe();
          return pipe.transform(value) + ' MBps';
        }
      }
    },
    {
      seriesName: 'Workload',
      opposite: true,
      labels: {

        formatter: function (value) {
          const pipe = new FormatThousandsPipe();
          return pipe.transform(value) + ' IOPS';
        }
      }
    }
  ];
  legend = {
    formatter: function (value, {seriesIndex, w}) {
      const labels = ['Transfer (MBps)', 'Workload (IOPS)'];
      return labels[seriesIndex];
    }
  };
  dataLabels = {enabled: false};
  series = [];
  title = {};
  perfMetricsType = [SystemMetricType.WORKLOAD, SystemMetricType.TRANSFER];
  capacityMetricsType = [
    SystemMetricType.SUBSCRIBED_CAPACITY,
    SystemMetricType.LOGICAL_CAPACITY,
    SystemMetricType.PHYSICAL_CAPACITY,
    SystemMetricType.LOGICAL_CHANGE_1M
  ];
  capacityMetricSimple = [
    SystemMetricType.LOGICAL_CAPACITY,
    SystemMetricType.PHYSICAL_CAPACITY,
    SystemMetricType.SUBSCRIBED_CAPACITY,
    SystemMetricType.WORKLOAD,
    SystemMetricType.TRANSFER
  ];
  regionOrder = [Region.EUROPE, Region.AMERICA, Region.ASIA];
  allMetricType = [...this.perfMetricsType, ...this.capacityMetricsType];
  useKFormatter = [SystemMetricType.WORKLOAD];

  constructor(private metricService: MetricService) {
  }

  ngOnInit() {
    this.metricLabels[SystemMetricType.WORKLOAD] = 'Total Workload';
    this.metricLabels[SystemMetricType.TRANSFER] = 'Total Transfer';
    this.metricLabels[SystemMetricType.LOGICAL_CAPACITY] = 'Logical Capacity';
    this.metricLabels[SystemMetricType.PHYSICAL_CAPACITY] = 'Physical Capacity';
    this.metricLabels[SystemMetricType.SUBSCRIBED_CAPACITY] = 'Subscribed Capacity';
    this.metricLabels[SystemMetricType.LOGICAL_CHANGE_1M] = 'Monthly Changed (logical)';

    this.alertLabels[AlertType.CAPACITY_USAGE] = 'Capacity Usage Events';
    this.alertLabels[AlertType.CPU] = 'CPU Utilization Events';
    this.alertLabels[AlertType.DISBALANCE_EVENTS] = 'CHA Pair Disbalance Events';
    this.alertLabels[AlertType.HDD] = 'HDD Utilization Events';
    this.alertLabels[AlertType.RESPONSE] = 'Latency Events';
    this.alertLabels[AlertType.SLA_EVENTS] = 'Out of SLA Events';
    this.alertLabels[AlertType.WRITE_PENDING] = 'Cache Write Pending Events';

    this.alertIcons[AlertType.CAPACITY_USAGE] = 'fa-chart-pie';
    this.alertIcons[AlertType.CPU] = 'fa-tachometer-alt';
    this.alertIcons[AlertType.DISBALANCE_EVENTS] = 'fa-random';
    this.alertIcons[AlertType.HDD] = 'fa-hdd';
    this.alertIcons[AlertType.RESPONSE] = 'fa-chart-line';
    this.alertIcons[AlertType.SLA_EVENTS] = 'fa-bell';
    this.alertIcons[AlertType.WRITE_PENDING] = 'fa-chart-bar';

    this.linkContext[AlertType.CAPACITY_USAGE] = 'physical-capacity';
    this.linkContext[AlertType.CPU] = 'performance';
    this.linkContext[AlertType.DISBALANCE_EVENTS] = 'adapters';
    this.linkContext[AlertType.HDD] = 'performance';
    this.linkContext[AlertType.RESPONSE] = 'performance';
    this.linkContext[AlertType.SLA_EVENTS] = 'dp-sla';
    this.linkContext[AlertType.WRITE_PENDING] = 'physical-capacity';

    this.alertsPerformance.push(AlertType.CPU, AlertType.HDD, AlertType.WRITE_PENDING, AlertType.RESPONSE);
    this.alertsOperations.push(AlertType.CAPACITY_USAGE, AlertType.SLA_EVENTS, AlertType.DISBALANCE_EVENTS);

    this.metricService.getInfrastructureStats().subscribe(stats => {
      console.log(stats);
      this.alerts = stats.alerts;
      this.metrics = this.transformCapacityMetrics(stats.metrics);
    });
    this.metricService.getDatacenters().subscribe(
      data => {
        this.datacenters = new Metric();
        this.datacenters.value = data.datacenters.length;
        this.datacenters.unit = '';
        this.registeredSystems = new Metric();
        this.registeredSystems.unit = '';
        this.registeredSystems.value = data.datacenters.reduce((previousValue, currentValue) => {
          return previousValue + currentValue.systems.length;
        }, 0);
      }
    );
    this.metricService.getGraphData([SystemMetricType.WORKLOAD, SystemMetricType.TRANSFER]).subscribe(dto => {
      dto.data.forEach(serie => {
        this.series.push({name: serie.type, data: serie.data});
      });
    });
    this.getMap();
  }

  transformCapacityMetrics(regionData: RegionMetricDto[]) {
    const transformer = new StorageConvertPipe();
    return regionData.map(
      region => {
        const mappedRegion = new RegionMetricDto();
        mappedRegion.region = region.region;
        this.allMetricType.forEach(
          type => {
            let metric;
            if (this.isSimpleChartMetric(type)) {
              metric = this.findMetricInRegion(region, type);
            } else { // here should be switch for specific type and also throw exception if unknown type
              const changeMetric = this.findMetricInRegion(region, SystemMetricType.CAPACITY_CHANGE_1M);
              const totalSaving = this.findMetricInRegion(region, SystemMetricType.TOTAL_SAVING_EFFECT);
              metric = new Metric();
              metric.unit = 'TB';
              metric.type = SystemMetricType.LOGICAL_CHANGE_1M;
              metric.value = changeMetric.value * totalSaving.value;
            }
            if (metric === undefined) {
              console.error('Cannot find ' + type + ' in ' + region);
            }
            const translatedMetric = transformer.transform(metric);
            mappedRegion.metrics.push(translatedMetric);
          }
        );
        return mappedRegion;
      }
    );
  }

  getMetricValueInRegions(type: SystemMetricType, regionOrder: Region[]) {
    const mappedValues: number[] = [];
    regionOrder.forEach(
      region => {
        const regionData = this.metrics.find(metrics => metrics.region === region);
        if (regionData === undefined) {
          console.error('Cannot find ' + region + ' in capacity statistics');
          return;
        }
        const metricValue = this.findMetricInRegion(regionData, type).value;
        mappedValues.push(this.roundNumber(metricValue));
      }
    );
    return mappedValues;
  }

  findMetricInRegion(regionData: RegionMetricDto, type): Metric {
    return regionData.metrics.find(metric => metric.type === type);
  }

  isSimpleChartMetric(type: SystemMetricType): boolean {
    return this.capacityMetricSimple.some(simpleType => simpleType === type);
  }

  roundNumber(value: number) {
    if (value === undefined) {
      return 0;
    }
    return parseInt(value.toFixed(2), 10);
  }

  findUnitInMetric(type: SystemMetricType): string {
    let foundUnit = '';
    this.metrics.forEach(
      region => {
        const foundMetric: Metric = region.metrics.find(metric => metric.type === type);
        if (foundMetric !== undefined) {
          foundUnit = foundMetric.unit;
        }
      }
    );
    return foundUnit;
  }

  containsType(alertType: AlertType, types: []) {
    return types.find(type => type === alertType) !== undefined;
  }

  getAlertIcon(type: SystemMetricType) {
    return this.alertIcons[type];
  }

  getMetricLabel(type: SystemMetricType) {
    return this.metricLabels[type];
  }

  getLinkContext(type: SystemMetricType) {
    return this.linkContext[type];
  }

  getThresholdMessage(type: AlertType, minValue: number, maxValue: number, unit: string) {
    if (maxValue == null && minValue == null) {
      return null;
    }
    let sanitizeUnit = unit;
    if (sanitizeUnit == null) {
      sanitizeUnit = '';
    }
    if (maxValue == null) {
      return `${this.getAlertLabel(type)} over ${minValue}${sanitizeUnit}`;
    }
    if (minValue == null) {
      return `${this.getAlertLabel(type)} under ${maxValue}${sanitizeUnit}`;
    }
    return `${this.getAlertLabel(type)} between ${minValue}${sanitizeUnit} and ${maxValue}${sanitizeUnit}`;
  }

  getAlertLabel(type: AlertType) {
    return this.alertLabels[type];
  }

  getColor(colorIndex): string {
    this.currentColor += 1;
    return this.colors[colorIndex % this.colors.length];
  }

  getRegionLabels() {
    return ['Europe', 'America', 'Asia'];
  }

  isKFormatterUsed(type: SystemMetricType): boolean {
    return this.useKFormatter.some(kType => kType === type);
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
