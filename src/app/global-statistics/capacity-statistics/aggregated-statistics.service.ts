import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ItemKey} from './capacity-statistics.component';
import {SystemAggregatedStatistics} from '../aggregated-statistics/aggregated-statistics.component';
import {WeightedArithmeticMean} from '../utils/WeightedArithmeticMean';

@Injectable({
  providedIn: 'root'
})
export class AggregatedStatisticsService {

  // Observable string sources
  private filterAnnoucement = new Subject<Array<ItemKey>>();
  private statsAnnoucement = new Subject<Array<SystemAggregatedStatistics>>();

  // Observable string streams
  filterAnnouncement$ = this.filterAnnoucement.asObservable();
  aggregatedStatistics$ = this.statsAnnoucement.asObservable();


  // Service message commands
  aggregateStatsBySystems(pools: Array<ItemKey>, poolMetrics: {}) {
    this.filterAnnoucement.next(pools);
    const mean = new WeightedArithmeticMean();

    this.announceStatistics(mean.computeSummaries(poolMetrics, pools));
  }

  announceStatistics(statistics: Array<SystemAggregatedStatistics>) {
    this.statsAnnoucement.next(statistics);
  }

}
