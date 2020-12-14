import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.css']
})
export class ConfirmWindowComponent implements OnInit {
  @Input()
  message = 'Are you sure?';
  @Input()
  open = true;
  @Output()
  changed = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

}
