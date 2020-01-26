import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  chart = {
    type: 'bar',
    animations: {enabled: false},
    height: '300px',
  };
  xaxis = {
    categories: [],
    title: {
      // text: 'TB'
    },
    labels: {
      formatter: function (val) {
        return Math.abs(Math.round(val)) + 'TB';
      }
    }
  };

  @Input() data;
  series = [{
    name: 'Europe',
    data: [78, -15, 33]
  }];
  labels;
  @Input()
  regionLabels = [];
  @Input()
  title = {text: 'Region', unit: '', useKFormatter: false}; // small hack for exposing unit attribute in formatters
  @Input()
  unit = '';
  @Input()
  useKFormatter = false;
  dataLabels = {
    enabled: true,
    formatter: function (value, {seriesIndex, dataPointIndex, w}) {
      return (Math.round(value)) + ' TB';
    }
  };

  plotOptions = {
    bar: {
      horizontal: true,
      // barHeight: '80%',

    },
  };
  colors = ['rgb(0, 143, 251)', 'rgb(0, 227, 150)', 'rgb(254, 176, 25)'];
  yaxis = {
    title: {},
  };
  private tooltip;

  constructor() {
  }

  ngOnInit() {
    this.series = this.convertToMoreSeries(this.data);
    this.xaxis.categories = [''];
    this.labels = this.regionLabels;
    this.labels.unit = this.unit;
    this.labels.useKFormatter = this.useKFormatter;
    this.title.text = this.title.text + ` (${this.labels.unit})`;
    this.tooltip = {
      y: {
        formatter: function (value, w) {
          return value + ' TB';
          // let unit = '';
          // let useKformatter = false;
          // if (w !== undefined && w.config !== undefined) {
          //   unit = w.config.labels.unit;
          //   useKformatter = w.config.labels.useKFormatter;
          // }
          // return NumberFormatter.kFormat(parseFloat(value).toFixed(0), useKformatter) + ' ' + unit;
        }
      }
    };
  }

  convertToMoreSeries(data: number[]) {
    const convertData = [];
    // tslint:disable-next-line:forin
    for (const i in this.regionLabels) {
      const emptyZeroArray = new Array(this.regionLabels.length).fill(0);
      emptyZeroArray[i] = data[i];
      convertData.push({name: this.regionLabels[i], data: emptyZeroArray});
    }
    return convertData;
  }
}
