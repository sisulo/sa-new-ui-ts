import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {NumberFormatter} from '../../../../global-statistics/utils/number.formatter';

@Component({
  selector: 'app-region-donut',
  templateUrl: './region-donut.component.html',
  styleUrls: ['./region-donut.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  title = {text: 'Region', unit: '', useKFormatter: false}; // small hack for exposing unit attribute in formatters
  @Input()
  unit = '';
  @Input()
  useKFormatter = false;
  dataLabels = {
    enabled: true,
    formatter: function (value, {seriesIndex, dataPointIndex, w}) {
      const serieValue = w.config.series[seriesIndex];
      return NumberFormatter.kFormat(parseFloat(serieValue).toFixed(0), w.config.labels.useKFormatter);
    }
  };


  plotOptions = {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: -20,
            fontSize: '12px'
          },
          value: {
            offsetY: -10,
          },
          total: {
            show: true,
            showAlways: true,
            offsetY: -10,
            formatter: function (w) {
              const aggValue = w.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
              return NumberFormatter.kFormat(parseFloat(aggValue).toFixed(0), w.config.labels.useKFormatter) + ' ' + w.config.labels.unit;
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

