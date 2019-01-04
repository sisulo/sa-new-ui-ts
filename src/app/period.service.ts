import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {PeriodType} from './metric.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  // Observable string sources
  private periodAnnoucement = new Subject<PeriodType>();

  // Observable string streams
  periodAnnoucement$ = this.periodAnnoucement.asObservable();


  // Service message commands
  announcePeriod(id: PeriodType) {
    this.periodAnnoucement.next(id);
  }

}
