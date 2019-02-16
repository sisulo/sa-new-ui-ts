import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';

@Component({
  selector: 'app-unit-formatter',
  templateUrl: './unit-formatter.component.html',
  styleUrls: ['./unit-formatter.component.css']
})
export class UnitFormatterComponent implements OnInit {

  @Input() label = '';
  @Input() alertMessage = '';

  @Input() public data: SystemMetric;

  constructor() { }

  ngOnInit() {
  }

  // extract to abstaract class and then extends simple-unit
  getValue(name: string) {
    if (this.data !== null) {
      return this.data[name] === undefined ? this.data : this.data[name];
    }
    return '';
  }

  isAlert(): boolean {
    return this.alertMessage !== '';
  }
}
