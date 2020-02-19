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

  private selectedValues: string[] = [];
  @Output()
  valueListChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor() {
  }

  ngOnInit() {

  }

  selectValue(selectedValue: string) {
    const foundIndex = this.selectedValues.findIndex(val => val === selectedValue);
    console.log(foundIndex);
    if (foundIndex >= 0) {
      this.selectedValues.splice(foundIndex, 1);
    } else {
      this.selectedValues.push(selectedValue);
    }
    this.valueListChange.emit(this.selectedValues);
    console.log(this.selectedValues);
  }
}
