import {AfterContentInit, AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MetricService, OperationData, ThreeDimensionValue} from '../../../../metric.service';
import {ApexAxisChartSeries, ChartComponent} from 'ng-apexcharts';
import {OperationType} from '../../../../common/models/metrics/operation-type.enum';
import {XaxisComponent} from './xaxis/xaxis.component';
import {YaxisComponent} from './yaxis/yaxis.component';
import {isEmpty} from 'rxjs/operators';
import {ArrayUtils} from '../../../../common/utils/array-utils';

interface Serie {
  name: string;
  data: number[][];
}

interface BubbleChartData {
  series: Serie[];
  xlabels: number[];
  ylabels: number[];
  crossing: { x: number, y: number };
}

export interface BubbleChartGraphic {
  width: number;
  height: number;
}

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit, AfterViewInit, OnChanges {

  constructor(private readonly metricService: MetricService) {
  }

  @ViewChild('bubble', {static: false})
  bubbleChart: BubbleChartComponent;
  @ViewChild('xaxis', {static: false})
  xaxis: XaxisComponent;
  @ViewChild('yaxis', {static: false})
  yaxis: YaxisComponent;
  data: ApexAxisChartSeries;
  @Input()
  poolIds: number[] = [];
  @Input()
  dates: string[] = []; // TODO should be date
  @Input()
  operations: string[] = ['READ', 'WRITE']; // TODO should be OperationType

  chartData: BubbleChartData = {
    series: [],
    xlabels: [0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
    ylabels: [0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256],
    crossing: {x: 32, y: 1}
  };
  optionsGraphic: BubbleChartGraphic = {
    width: 800,
    height: 500
  };

  ngOnInit() {
    console.log(this.dates);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.poolIds.length > 0 && this.dates.length > 0) {
      this.metricService.getLatencyData(this.poolIds, this.dates, this.operations).subscribe(data => {
          this.chartData.series = this.transformData(data);
        }
      );
    }
  }

  ngAfterViewInit(): void {
    const coordinatesX = this.xaxis.getCoordinates();
    const coordinatesY = this.yaxis.getCoordinates();
    this.xaxis.setOffSetCoordinates(coordinatesY);
    this.yaxis.setOffSetCoordinates(coordinatesX);
  }

  transformData(data: OperationData[]): Serie[] {
    const returned = data.map(
      operationData => {
        const min = this.min(operationData.values);
        const max = this.max(operationData.values);
        return {
          name: OperationType[operationData.operation],
          data: operationData.values.map(value => this.mapToCoordinates(value, min, max))
        };
      }
    );
    return returned;
  }

  countCircleSize(value, min, max) {
    return (value / max) * 55;
  }

  max(data: ThreeDimensionValue[]) {
    return data.reduce(
      (previousValue, currentValue) =>
        previousValue.z < currentValue.z ? currentValue : previousValue,
      {z: 0}).z;
  }

  min(data: ThreeDimensionValue[]) {
    return data.reduce(
      (previousValue, currentValue) =>
        previousValue.z > currentValue.z ? currentValue : previousValue,
      {z: 0}).z;
  }

  mapToCoordinates(value: ThreeDimensionValue, min, max) {
    return [
      this.xaxis.getCoordinateByLabel(value.x).x,
      this.yaxis.getCoordinateByLabel(value.y).y,
      this.countCircleSize(value.z, min, max)
    ];
  }
}
