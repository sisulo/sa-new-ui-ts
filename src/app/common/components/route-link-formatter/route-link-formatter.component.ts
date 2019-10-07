import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-route-link-formatter',
  templateUrl: './route-link-formatter.component.html',
  styleUrls: ['./route-link-formatter.component.css']
})
export class RouteLinkFormatterComponent implements OnInit {

  @Input() public data;
  @Input() public label;

  constructor() {

  }

  ngOnInit() {
  }
}
