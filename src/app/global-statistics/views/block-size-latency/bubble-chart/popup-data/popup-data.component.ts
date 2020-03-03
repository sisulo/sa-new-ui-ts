import {Component, Input, OnInit} from '@angular/core';
import {PopUpConfig} from '../bubble-chart.component';

@Component({
  selector: '[app-popup-data]',
  templateUrl: './popup-data.component.html',
  styleUrls: ['./popup-data.component.css']
})
export class PopupDataComponent implements OnInit {

  @Input()
  positionX: number;

  @Input()
  displayed = false;

  @Input()
  config: PopUpConfig = null;

  constructor() {
  }

  ngOnInit() {
  }

}
