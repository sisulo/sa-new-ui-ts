import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-emph-formatter',
  templateUrl: './emph-formatter.component.html',
  styleUrls: ['./emph-formatter.component.css']
})
export class EmphFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;
  @Input() public column;

  constructor() {
  }

  ngOnInit() {
  }


}
