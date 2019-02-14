import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';

@Component({
  selector: 'app-unit-formatter',
  templateUrl: './unit-formatter.component.html',
  styleUrls: ['./unit-formatter.component.css']
})
export class UnitFormatterComponent implements OnInit {

  @Input() metric: SystemMetric;
  @Input() metricLabel = '';
  @Input() alertMessage = '';

  @Input() public data;

  constructor() { }

  ngOnInit() {
    console.log(this.data);

  }

  // extract to abstaract class and then extends simple-unit
  getValue(name: string) {
    if (this.data !== null) {
      return this.data.rawData[name] === undefined ? this.data : this.data.rawData[name];
    }
    return '';
  }

  isAlert(): boolean {
    return this.alertMessage !== '';
  }
}
