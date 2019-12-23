import {Component, Input, OnInit} from '@angular/core';
import {Metric} from '../../models/metrics/metric.vo';

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

  ngOnInit() {
    // if (this.metric !== undefined) {
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
          skin: {
            type: 'tron',
            width: 2,
            color: this.color,
            spaceWidth: 4
          },
          readOnly: true,
          size: 100,
          unit: this.metric.unit,
          textColor: this.color,
          fontSize: '25',
          fontWeight: '800',
          fontFamily: 'Roboto',
          min: 0,
          max: this.metric.unit === '%' ? 100 : this.metric.value,
          trackWidth: 20,
          barWidth: 25,
          trackColor: '#D8D8D8',
          barColor: this.color,
        };
        break;
    }
  }
}
