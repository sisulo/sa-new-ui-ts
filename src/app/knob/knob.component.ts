import {Component, Input, OnInit} from '@angular/core';
import {InfraMetric} from '../models/metrics/InfraMetric';

@Component({
  selector: 'app-knob',
  templateUrl: './knob.component.html',
  styleUrls: ['./knob.component.css']
})
export class KnobComponent implements OnInit {

  @Input() metric: InfraMetric;
  @Input() color = '#225bb7';

  knOptions = {};

  constructor() { }

  ngOnInit() {
    this.knOptions = {
      readOnly: true,
      size: 150,
      unit: this.metric.unit,
      textColor: this.color,
      fontSize: '25',
      fontWeigth: '700',
      fontFamily: 'Roboto',
      max: this.metric.unit === '%' ? 100 : this.metric.value,
      trackWidth: 19,
      barWidth: 20,
      trackColor: '#D8D8D8',
      barColor: this.color,
    };
  }

}
