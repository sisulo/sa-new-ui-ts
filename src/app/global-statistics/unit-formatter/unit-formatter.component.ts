import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';

@Component({
  selector: 'app-unit-formatter',
  templateUrl: './unit-formatter.component.html',
  styleUrls: ['./unit-formatter.component.css']
})
export class UnitFormatterComponent implements OnInit {

  @Input() metric: SystemMetric;
  // @Input() isAlert = false;
  @Input() metricLabel = '';
  @Input() alertMessage = '';

  constructor() { }

  ngOnInit() {


  }

  isAlert(): boolean {
    return this.alertMessage !== '';
  }
}
