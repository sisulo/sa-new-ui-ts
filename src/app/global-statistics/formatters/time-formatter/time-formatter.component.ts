import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';

@Component({
  selector: 'app-time-formatter',
  templateUrl: './time-formatter.component.html',
  styleUrls: ['./time-formatter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeFormatterComponent extends UnitFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;
  @Input() public column;

  constructor() {
    super();
  }

}
