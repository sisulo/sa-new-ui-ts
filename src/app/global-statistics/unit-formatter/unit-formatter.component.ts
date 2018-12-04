import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../models/metrics/SystemMetric';

@Component({
  selector: 'app-unit-formatter',
  templateUrl: './unit-formatter.component.html',
  styleUrls: ['./unit-formatter.component.css']
})
export class UnitFormatterComponent implements OnInit {

  @Input() metric: SystemMetric;
  constructor() { }

  ngOnInit() {
  }

}
