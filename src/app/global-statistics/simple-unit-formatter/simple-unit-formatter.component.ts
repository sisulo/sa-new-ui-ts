import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-simple-unit-formatter',
  templateUrl: './simple-unit-formatter.component.html',
  styleUrls: ['./simple-unit-formatter.component.css']
})
export class SimpleUnitFormatterComponent implements OnInit {

  @Input() public data;

  constructor() {
  }

  ngOnInit() {
  }

  getValue() {
    if (this.data !== null) {
      return this.data.value === undefined ? this.data : this.data.value;
    }
    return '';
  }
}
