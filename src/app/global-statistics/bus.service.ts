import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  // Observable string sources
  private datacenterAnnoucement = new Subject<number>();

  // Observable string streams
  datacenterAnnouncement$ = this.datacenterAnnoucement.asObservable();


  // Service message commands
  announceDatacenter(id: number) {
    this.datacenterAnnoucement.next(id);
  }

}
