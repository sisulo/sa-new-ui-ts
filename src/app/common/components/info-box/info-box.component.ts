import {Component, Input, OnInit} from '@angular/core';
import {AlertType} from '../../models/metrics/AlertType';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {

  @Input() value: number;
  @Input() label: string;
  @Input() threshold = 1;
  constructor() { }

  ngOnInit() {
  }

  isOverThreshold() {
    return this.value > this.threshold;
  }
}
