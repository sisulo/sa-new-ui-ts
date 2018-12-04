import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  // Observable string sources
  private datacenterAnnoucement = new Subject<number>();
  private tabAnnoucement = new Subject<number>();

  // Observable string streams
  datacenterAnnouncement$ = this.datacenterAnnoucement.asObservable();
  tabAnnouncement$ = this.tabAnnoucement.asObservable();


  // Service message commands
  announceDatacenter(id: number) {
    this.datacenterAnnoucement.next(id);
  }

  announceTab(id: number) {
    this.tabAnnoucement.next(id);
  }

}
