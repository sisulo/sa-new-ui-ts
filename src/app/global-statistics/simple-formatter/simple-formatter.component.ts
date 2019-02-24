import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-simple-formatter',
  templateUrl: './simple-formatter.component.html',
  styleUrls: ['./simple-formatter.component.css']
})
export class SimpleFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;

  constructor() {
  }

  ngOnInit() {
  }

}
