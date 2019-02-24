import {Component, Input, OnInit} from '@angular/core';
import {SasiGroupRow, SasiTableOptions} from '../sasi-table.component';

@Component({
  selector: 'app-row-group-table',
  templateUrl: './row-group-table.component.html',
  styleUrls: ['./row-group-table.component.css']
})
export class RowGroupTableComponent implements OnInit {

  @Input() data: SasiGroupRow;
  @Input() columnHighlightEnable = false;
  @Input() options: SasiTableOptions;

  constructor() { }

  ngOnInit() {
  }

}
