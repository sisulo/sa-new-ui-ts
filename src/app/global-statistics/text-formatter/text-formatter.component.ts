import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/SystemMetric';

@Component({
  selector: 'app-text-formatter',
  templateUrl: './text-formatter.component.html',
  styleUrls: ['./text-formatter.component.css']
})
export class TextFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;

  constructor() { }

  ngOnInit() {
  }

}
