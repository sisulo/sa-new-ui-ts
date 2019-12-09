import {Component, Input, OnInit} from '@angular/core';
import {FormatThousandsPipe} from '../../../../common/utils/format-thousands.pipe';

@Component({
  selector: 'app-capacity-history-chart',
  templateUrl: './capacity-history-chart.component.html',
  styleUrls: ['./capacity-history-chart.component.css']
})
export class CapacityHistoryChartComponent implements OnInit {

  @Input() series = [];
  chart = {type: 'area', height: '300'};
  xaxis = {type: 'datetime', labels: {format: 'yyyy-MM-dd'}};
  colors = ['#a09608', '#38a008', '#08a09d', '#421570', '#f56954'];
  dataLabels = {enabled: false};
  title = {};
  yaxis = [
    {
      labels: {
        formatter: function (value) {
          const pipe = new FormatThousandsPipe();
          return pipe.transform(value) + ' TB';
        }
      }
    },
  ];
  legend = {
    formatter: function (value, {seriesIndex, w}) {
      const labels = ['Subscribed Capacity (TB)', 'Logical Capacity (TB)', 'Physical Capacity (TB)'];
      return labels[seriesIndex];
    }
  };

  constructor() {
  }

  ngOnInit() {
  }

}
