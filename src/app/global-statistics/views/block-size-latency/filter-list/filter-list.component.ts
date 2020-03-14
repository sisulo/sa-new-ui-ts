import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterListComponent implements OnInit {

  @Input()
  private valueList: string[];
  @Input()
  private title: string;
  @Input()
  private selectedValues: string[] = [];
  @Output()
  valueListChange: EventEmitter<string[]> = new EventEmitter<string[]>();


  constructor() {
  }

  ngOnInit() {

  }

  selectValue(value) {
    this.valueListChange.emit(this.selectedValues);
  }
}
