import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HighlightColumnService {
  // Observable string sources
  private highlightColumn = new Subject<number>();
  // Observable string streams
  highlightColumn$ = this.highlightColumn.asObservable();

  // Service message commands
  setHighlightColumn(value) {
    // console.log('Highlight column: ' + value);
    this.highlightColumn.next(value);
  }
}
