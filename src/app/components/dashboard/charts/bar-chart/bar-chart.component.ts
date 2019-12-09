import {Component, Input, OnInit} from '@angular/core';
import {NumberFormatter} from '../../../../global-statistics/utils/number.formatter';

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
      text: 'TB'
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
      return Math.abs(Math.round(value)) + 'TB';
    }
  };


  // plotOptions = {
  //   pie: {
  //     donut: {
  //       labels: {
  //         show: true,
  //         name: {
  //           show: true,
  //           offsetY: -20,
  //           fontSize: '12px'
  //         },
  //         value: {
  //           offsetY: -10,
  //         },
  //         total: {
  //           show: true,
  //           showAlways: true,
  //           offsetY: -10,
  //           formatter: function (w) {
  //             const aggValue = w.globals.seriesTotals.reduce((a, b) => {
  //               return a + b;
  //             }, 0);
  //             return NumberFormatter.kFormat(parseFloat(aggValue).toFixed(0), w.config.labels.useKFormatter) + ' ' + w.config.labels.unit;
  //           }
  //         }
  //       }
  //     }
  //   }

  // };
  plotOptions = {
    bar: {
      horizontal: true,
      barHeight: '80%',

    },
  };
  colors = ['#F44336', '#E91E63', '#9C27B0'];
  yaxis = {
    min: -405,
    max: 405,
    title: {
      // text: 'Age',
    },
  };
  private tooltip;

  constructor() {
  }

  ngOnInit() {
    this.series = [{name: 'Monthly changed', data: this.data}];
    console.log(this.data);
    this.xaxis.categories = this.regionLabels;
    this.labels = this.regionLabels;
    this.labels.unit = this.unit;
    this.labels.useKFormatter = this.useKFormatter;
    this.title.text = this.title.text + ` (${this.labels.unit})`;
    this.tooltip = {
      y: {
        formatter: function (value, w) {
          let unit = '';
          let useKformatter = false;
          if (w !== undefined && w.config !== undefined) {
            unit = w.config.labels.unit;
            useKformatter = w.config.labels.useKFormatter;
          }
          return NumberFormatter.kFormat(parseFloat(value).toFixed(0), useKformatter) + ' ' + unit;
        }
      }
    };
  }
}
