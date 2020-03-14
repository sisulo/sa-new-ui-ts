import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgSelectComponent} from '@ng-select/ng-select';
import {FilterListData} from '../block-size-latency.component';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterListComponent implements OnInit {

  @Input()
  private valueList: FilterListData[];
  @Input()
  private title: string;
  @Input()
  private selectedValues: string[] | number[] = [];
  @Output()
  valueListChange: EventEmitter<string[] | number[]> = new EventEmitter<string[] | number[]>();


  constructor() {
  }

  ngOnInit() {

  }

  selectValue(value) {
    this.valueListChange.emit(this.selectedValues);
  }

  selectAll() {
    this.selectedValues = this.valueList.map(value => value.id as number);
    this.valueListChange.emit(this.selectedValues);
  }

  clear() {
    this.valueListChange.emit(this.selectedValues);
  }
}
