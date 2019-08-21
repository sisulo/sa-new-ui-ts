import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-time-formatter',
  templateUrl: './time-formatter.component.html',
  styleUrls: ['./time-formatter.component.css']
})
export class TimeFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;
  @Input() public column;

  constructor() { }

  ngOnInit() {
  }

  getTooltipMessage(): string {
    if (this.column !== undefined) {
      return this.column.tooltipText;
    }
  }
}
