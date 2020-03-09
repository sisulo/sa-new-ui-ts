import {Component, Input, OnInit} from '@angular/core';
import {BubbleChartData, BubbleChartGraphic} from '../bubble-chart.component';
import {Coordinates} from '../xaxis/xaxis.component';

@Component({
  selector: '[app-yaxis]',
  templateUrl: './yaxis.component.html',
  styleUrls: ['./yaxis.component.css']
})
export class YaxisComponent implements OnInit {

  @Input()
  labels: number[];

  @Input()
  canvas: BubbleChartGraphic;

  @Input()
  chartData: BubbleChartData;

  x1: number;
  y1: number;
  y2: number;

  markerLength = 5;
  markerEnds: number;

  marginSize = 30;
  axisLength: number;

  textAnchor = 'end';
  textOffset = 10;

  coordinates: Coordinates;
  labelsCoordinates: Coordinates[] = [];

  constructor() {
  }

  ngOnInit() {
    this.x1 = this.canvas.width / 2;
    this.y1 = this.marginSize;
    this.setUpAxis();
  }

  private setUpAxis() {
    this.markerEnds = this.x1 - this.markerLength;
    this.axisLength = this.canvas.height - (2 * this.marginSize);
    this.y2 = this.axisLength + this.marginSize;
    this.coordinates = {x: this.x1, y: this.getLabelPosition(this.labels.findIndex(label => label === this.chartData.crossing.y))};
    this.labels.forEach((label, index) => {
      this.labelsCoordinates[index] = {x: this.x1, y: this.getLabelPosition(index)};
    });
  }

  getLabelPosition(index: number) {
    if (index === 0) {
      return this.y2;
    }
    return this.y2 - ((this.axisLength / (this.labels.length - 1)) * index);
  }

  getCoordinates() {
    return this.coordinates;
  }

  setOffSetCoordinates(coordinates: Coordinates) {
    this.coordinates = coordinates;
    this.x1 = coordinates.x;
    this.setUpAxis();
  }

  getCoordinateByLabel(label: number) {
    const index = this.labels.findIndex(l => l === label);
    return this.labelsCoordinates[index];
  }

  formatLabel(label: number, index: number) {
    return this.chartData.yFormatter.call(this, label, index) || label;
  }
}
