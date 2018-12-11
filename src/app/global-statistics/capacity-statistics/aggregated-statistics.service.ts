import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ItemKey} from './capacity-statistics.component';

@Injectable({
  providedIn: 'root'
})
export class AggregatedStatisticsService {

  // Observable string sources
  private filterAnnoucement = new Subject<Array<ItemKey>>();
  // private metricsAnnoucement = new Subject<number>();

  // Observable string streams
  filterAnnouncement$ = this.filterAnnoucement.asObservable();
  // metricAnnouncement$ = this.metricsAnnoucement.asObservable();


  // Service message commands
  announceFilter(pools: Array<ItemKey>) {
    this.filterAnnoucement.next(pools);
  }

  // announceMetrics(id: SelectedItems) {
  //   this.metricsAnnoucement.next(id);
  // }

}
