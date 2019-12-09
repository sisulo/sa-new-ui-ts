import {Component, Input, OnInit} from '@angular/core';
import {FormatThousandsPipe} from '../../../../common/utils/format-thousands.pipe';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css']
})
export class HistoryChartComponent implements OnInit {

  @Input() series = [];
  chart = {type: 'area', height: '300'};
  xaxis = {type: 'datetime', labels: {format: 'yyyy-MM-dd'}};
  colors = ['#a09608', '#38a008', '#08a09d', '#421570', '#f56954'];
  dataLabels = {enabled: false};
  title = {};
  yaxis = [
    {
      seriesName: 'Transfer',
      labels: {
        formatter: function (value) {
          const pipe = new FormatThousandsPipe();
          return pipe.transform(value) + ' MBps';
        }
      }
    },
    {
      seriesName: 'Workload',
      opposite: true,
      labels: {

        formatter: function (value) {
          const pipe = new FormatThousandsPipe();
          return pipe.transform(value) + ' IOPS';
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
  }

}
