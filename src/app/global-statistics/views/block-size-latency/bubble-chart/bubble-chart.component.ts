import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MetricService, OperationData} from '../../../../metric.service';
import {ApexAxisChartSeries, ChartComponent} from 'ng-apexcharts';
import {OperationType} from '../../../../common/models/metrics/operation-type.enum';


@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit, OnChanges {

  constructor(private readonly metricService: MetricService) {
  }

  @ViewChild('chart', {static: false}) chart: ChartComponent;
  data: ApexAxisChartSeries;
  @Input()
  poolIds: number[] = [9];
  @Input()
  dates: string[] = []; // TODO should be date
  @Input()
  operations: string[] = ['READ', 'WRITE']; // TODO should be OperationType

  chartOptions = {
    series: null,
    chart: {
      type: 'bubble',
      height: 350,
      width: 800
    },
    yaxis: {
      type: 'numeric',
      min: 0.0625,
      max: 512,
      tickAmount: 10,
      logarithmic: true,
      axisBorder: {
        show: true,
        offsetX: 88.5
      }
    },
    xaxis: {
      // type: 'category',
      // categories: [0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
      min: 0,
      max: 256,
      tickAmount: 10,
      axisBorder: {
        offsetY: -82
      }
    },
    fill: {
      opacity: 0.8
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      show: false
    }
  };

  ngOnInit() {
    console.log(this.dates);
    this.metricService.getLatencyData(this.poolIds, this.dates, this.operations).subscribe(data => {
        this.chartOptions.series = this.transformData(data);
        console.log(this.chartOptions.series);
      }
    );
  }

  transformData(data: OperationData[]): ApexAxisChartSeries {
    const returned = data.map(
      operationData => {
        return {
          name: OperationType[operationData.operation],
          data: operationData.values.map(value => [value.x, value.y, value.z])
        };
      }
    );
    return returned as ApexAxisChartSeries;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.metricService.getLatencyData(this.poolIds, this.dates, this.operations).subscribe(data => {
        this.chartOptions.series = this.transformData(data);
        console.log(this.chartOptions.series);
      }
    );
  }

}
