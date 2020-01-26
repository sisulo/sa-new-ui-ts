import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormatThousandsPipe} from '../../../../common/utils/format-thousands.pipe';
import {ApexYAxis} from 'ng-apexcharts/lib/model/apex-types';
import {ArrayUtils} from '../../../../common/utils/array-utils';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryChartComponent implements OnInit {

  @Input() series = [];
  chart = {type: 'area', height: '300'};
  xaxis = {type: 'datetime', labels: {format: 'yyyy-MM-dd'}};
  colors = ['#a09608', '#38a008', '#08a09d', '#421570', '#f56954'];
  dataLabels = {enabled: false};
  title = {};
  yaxis: ApexYAxis[] = [
    {
      seriesName: 'TRANSFER',
      labels: {
        formatter: function (value) {
          const pipe = new FormatThousandsPipe();
          return pipe.transform(value.toString()) + ' MBps';
        }
      },
      forceNiceScale: true,
    },
    {
      seriesName: 'WORKLOAD',
      opposite: true,
      forceNiceScale: true,
      labels: {

        formatter: function (value) {
          const pipe = new FormatThousandsPipe();
          return pipe.transform(value.toString()) + ' IOPS';
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

  constructor() {
  }

  ngOnInit() {
    this.series.forEach(
      serie => this.setMinimum(serie)
    );
    this.series.forEach(
      serie => this.setMaximum(serie)
    );
  }

  setMinimum(serie) {
    const yaxis = this.yaxis.find(y => y.seriesName === serie.name);
    const yValues = serie.data.map(value => value.y);
    yaxis.min = ArrayUtils.min(yValues);
  }

  setMaximum(serie) {
    const yaxis = this.yaxis.find(y => y.seriesName === serie.name);
    const yValues = serie.data.map(value => value.y);
    yaxis.max = ArrayUtils.max(yValues);
  }
}
