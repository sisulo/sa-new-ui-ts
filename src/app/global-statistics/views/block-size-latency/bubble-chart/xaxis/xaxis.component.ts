import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BubbleChartGraphic} from '../bubble-chart.component';

export interface Coordinates {
  x: number;
  y: number;
}

@Component({
  selector: '[app-xaxis]',
  templateUrl: './xaxis.component.html',
  styleUrls: ['./xaxis.component.css']
})
export class XaxisComponent implements OnInit {

  @Input()
  labels: number[];
  @Input()
  canvas: BubbleChartGraphic;

  coordinates: Coordinates;

  x1: number;
  y1: number;
  y2: number;

  markerLength = 5;
  markerEnds: number;

  marginSize = 30;
  axisLength: number;

  textAnchor = 'middle';
  textOffset = 20;

  labelsCoordinates: Coordinates[] = [];

  constructor() {
  }

  ngOnInit() {
    this.x1 = this.marginSize;
    this.y1 = (this.canvas.height - (2 * this.marginSize)) / 2;
    this.setUpAxis();
  }

  private setUpAxis() {
    this.markerEnds = this.y1 + this.markerLength;
    this.axisLength = this.canvas.width - (2 * this.marginSize);
    this.y2 = this.axisLength + this.marginSize;
    this.coordinates = {x: this.getLabelPosition(this.labels.findIndex(label => label === 32)), y: this.y1};
    this.labels.forEach((label, index) => {
      this.labelsCoordinates[index] = {x: this.getLabelPosition(index), y: this.y1};
    });
  }

  getCoordinates() {
    return this.coordinates;
  }

  setOffSetCoordinates(coordinates: Coordinates) {
    this.coordinates = coordinates;
    this.y1 = coordinates.y;
    this.setUpAxis();
  }

  getLabelPosition(index: number) {
    if (index === 0) {
      return this.marginSize;
    }
    return ((this.axisLength / (this.labels.length - 1)) * index) + this.marginSize;
  }

  getCoordinateByLabel(label: number) {
    const index = this.labels.findIndex(l => l === label);
    return this.labelsCoordinates[index];
  }
}
