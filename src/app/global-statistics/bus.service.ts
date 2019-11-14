import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  // Observable string sources
  private datacenterAnnoucement = new Subject<number>();
  private contextAnnoucement = new Subject<string>();

  // Observable string streams
  datacenterAnnouncement$ = this.datacenterAnnoucement.asObservable();
  contextAnnouncement$ = this.contextAnnoucement.asObservable();


  // Service message commands
  announceDatacenter(id: number) {
    this.datacenterAnnoucement.next(id);
  }

  announceContext(contextName: string) {
    this.contextAnnoucement.next(contextName);
  }

}
