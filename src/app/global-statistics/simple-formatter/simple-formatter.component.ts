import {Component, Input, OnInit} from '@angular/core';
import {UnitFormatterComponent} from '../unit-formatter/unit-formatter.component';

@Component({
  selector: 'app-simple-formatter',
  templateUrl: './simple-formatter.component.html',
  styleUrls: ['./simple-formatter.component.css']
})
export class SimpleFormatterComponent extends UnitFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
