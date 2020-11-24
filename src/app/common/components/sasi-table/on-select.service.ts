import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {SelectedRow} from './row-table/selected-row';

@Injectable({
  providedIn: 'root'
})
export class OnSelectService {

  // Observable string sources
  private selectAll = new Subject<boolean>();
  private selectedRows = new Subject<SelectedRow[]>();
  // Observable string streams
  selectAll$ = this.selectAll.asObservable();
  selectRows$ = this.selectedRows.asObservable();

  // Service message commands
  announceSelectAll(value) {
    this.selectAll.next(value);
  }

  announceSelect(rows: SelectedRow[]) {
    this.selectedRows.next(rows);
  }


}
