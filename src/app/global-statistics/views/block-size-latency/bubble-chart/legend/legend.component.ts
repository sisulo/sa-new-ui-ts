import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Serie} from '../bubble-chart.component';

@Component({
  selector: '[app-legend]',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit, OnChanges {

  @Input()
  series: Serie[];

  @Input()
  colors: string[] = [];

  @Output()
  selectedSeriesEmit = new EventEmitter<string[]>();

  seriesInit: string[];
  selectedSeries: string[] = [];

  constructor() {
  }

  ngOnInit() {
    this.seriesInit = this.series.map(serie => serie.name);
    this.selectedSeries = this.seriesInit;
  }

  getColor(index: number) {
    return this.colors[index];
  }

  toggle(serieName: string) {
    const index = this.selectedSeries.findIndex(selectedSerie => selectedSerie === serieName);
    if (index > -1) {
      this.selectedSeries.splice(index, 1);
    } else {
      this.selectedSeries.push(serieName);
    }
    this.selectedSeriesEmit.emit(this.selectedSeries);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.seriesInit = this.series.map(serie => serie.name);
    this.selectedSeries = this.seriesInit;
  }

  isToggled(serieName: string) {
    return this.selectedSeries.some(serie => serie === serieName);
  }
}
