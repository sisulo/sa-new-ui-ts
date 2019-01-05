import {Component, Input, OnInit} from '@angular/core';
import {Metric} from '../../models/metrics/Metric';


@Component({
  selector: 'app-knob',
  templateUrl: './knob-sa.component.html',
  styleUrls: ['./knob-sa.component.css']
})
export class KnobSaComponent implements OnInit {

  @Input() metric: Metric;
  @Input() label: string;
  @Input() color = '#225bb7';
  @Input() sizeType = 'medium';
  knOptions = {};

  constructor() {
  }

  ngOnInit() {
    console.log(this.metric);
    switch (this.sizeType) {
      case 'medium':

        this.knOptions = {
          readOnly: true,
          size: 150,
          unit: this.metric.unit,
          textColor: this.color,
          fontSize: '25',
          fontWeight: '400',
          fontFamily: 'Roboto',
          min: 0,
          max: this.metric.unit === '%' ? 100 : this.metric.value,
          trackWidth: 19,
          barWidth: 20,
          trackColor: '#D8D8D8',
          barColor: this.color,
        };
        break;
      case 'small':
        this.knOptions = {
          readOnly: true,
          size: 70,
          unit: this.metric.unit,
          textColor: this.color,
          fontSize: '10',
          fontWeight: '400',
          fontFamily: 'Roboto',
          min: 0,
          max: this.metric.unit === '%' ? 100 : this.metric.value,
          trackWidth: 5,
          barWidth: 10,
          trackColor: '#D8D8D8',
          barColor: this.color,
        };
        break;
    }
  }
}
