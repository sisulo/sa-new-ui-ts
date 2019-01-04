import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {PeriodType} from './metric.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  // Observable string sources
  private periodAnnoucement = new Subject<PeriodType>();
  private periodEnableAnnoucement = new Subject<boolean>();

  // Observable string streams
  periodAnnouncement$ = this.periodAnnoucement.asObservable();

  periodEnableAnnouncement = this.periodEnableAnnoucement.asObservable();

  // Service message commands
  announcePeriod(id: PeriodType) {
    this.periodAnnoucement.next(id);
  }

  announceEnablePeriod(enable: boolean) {
    this.periodEnableAnnoucement.next(enable);
  }

}
