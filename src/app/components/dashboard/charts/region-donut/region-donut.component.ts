import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-region-donut',
  templateUrl: './region-donut.component.html',
  styleUrls: ['./region-donut.component.css']
})
export class RegionDonutComponent implements OnInit {
  chart = {
    type: 'donut',
    animations: {enabled: false},
    height: '220px'
  };
  @Input() data;
  series;
  labels;
  @Input()
  regionLabels = [];
  @Input()
  title = {text: 'Region', unit: ''}; // small hack for exposing unit attribute in formatters
  @Input()
  unit = '';
  dataLabels = {
    enabled: true,
    formatter: function (value, {seriesIndex, dataPointIndex, w}) {
      const serieValue = w.config.series[seriesIndex];
      return parseFloat(serieValue).toFixed(0);
    }
  };


  plotOptions = {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: -20
          },
          value: {
            offsetY: -10,
            formatter: function (val, {series, seriesIndex, dataPointIndex, w}) {
              return parseFloat(val).toFixed(0) + ' ' + w.config.labels.unit;
            }
          },
          total: {
            show: true,
            showAlways: true,
            offsetY: -10,
            formatter: function (w) {
              const aggValue = w.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
              return parseFloat(aggValue).toFixed(0) + ' ' + w.config.labels.unit;
            }
          }
        }
      }
    }
  };
  private tooltip;

  constructor() {
  }

  ngOnInit() {
    this.series = this.data;
    this.labels = this.regionLabels;
    this.labels.unit = this.unit;
    this.title.text = this.title.text + ` (${this.labels.unit})`;
    this.tooltip = {
      y: {
        formatter: function (value, w) {
          let unit = '';
          if (w !== undefined && w.config !== undefined) {
            unit = w.config.labels.unit;
          }
          return parseFloat(value).toFixed(0) + ' ' + unit;
        }
      }
    };
  }

}
