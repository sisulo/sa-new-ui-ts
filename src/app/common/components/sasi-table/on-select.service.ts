import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnSelectService {

  // Observable string sources
  private selectAll = new Subject<boolean>();
  // Observable string streams
  selectAll$ = this.selectAll.asObservable();

  // Service message commands
  announceSelectAll(value) {
    this.selectAll.next(value);
  }


}
