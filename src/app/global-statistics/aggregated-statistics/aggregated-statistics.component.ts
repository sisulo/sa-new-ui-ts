import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SystemMetric} from '../../models/metrics/SystemMetric';
import {SystemMetricType} from '../../models/metrics/SystemMetricType';
import {ItemKey} from '../capacity-statistics/capacity-statistics.component';
import {AggregatedStatisticsService} from '../capacity-statistics/aggregated-statistics.service';


class AggregatedStatistics {
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalUsed = 0;
  physicalUsed = 0;
  compressionRatio = 0;
}
class SystemAggregatedStatistics extends AggregatedStatistics {
  system = null;
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalUsed = 0;
  physicalUsed = 0;
  compressionRatio = 0;

  constructor(systemName: string) {
    super();
    this.system = systemName;
  }

}

@Component({
  selector: 'app-aggregated-statistics',
  templateUrl: './aggregated-statistics.component.html',
  styleUrls: ['./aggregated-statistics.component.css']
})
export class AggregatedStatisticsComponent implements OnInit, OnChanges {

  summarizedValues: AggregatedStatistics = new AggregatedStatistics();
  partiallySummarizedValues: SystemAggregatedStatistics[] = [];
  @Input() dataCenterId: 0;
  @Input() metrics: [];
  @Input() filter: Array<ItemKey> = [];

  constructor(
    private aggregatedStatisticService: AggregatedStatisticsService
  ) {
  }

  ngOnInit() {
    this.aggregatedStatisticService.filterAnnouncement$.subscribe(
      data => {
        this.filter = data;
        this.computeSummaries();
      }
    );
  }

  computeSummaries(): void {
    const summarizedValues = this.summarizedValues;
    this.partiallySummarizedValues = [];
    this.filter.forEach(
      key => {
        const metrics: SystemMetric[] = this.metrics[key.poolName];
        const physicalCapacity = this.getMetricByName(metrics, SystemMetricType.PHYSICAL_CAPACITY);
        let systemStats = this.getSystemStatistics(key.systemName);
        if (systemStats === undefined) {
          systemStats = new SystemAggregatedStatistics(key.systemName);
          this.partiallySummarizedValues.push(systemStats);
        }
        systemStats.physicalCapacity += physicalCapacity;
        systemStats.physicalSubstitution += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_SUBS) * physicalCapacity;
        systemStats.availableCapacity += this.getMetricByName(metrics, SystemMetricType.AVAILABLE_CAPACITY);
        systemStats.logicalUsed += this.getMetricByName(metrics, SystemMetricType.LOGICAL_USAGE) * physicalCapacity;
        systemStats.physicalUsed += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_USAGE) * physicalCapacity;
        systemStats.compressionRatio += this.getMetricByName(metrics, SystemMetricType.COMPRESS_RATIO) * physicalCapacity;
      }
    );
    this.summarizedValues.physicalCapacity = this.sum('physicalCapacity');
    this.summarizedValues.physicalSubstitution = this.sum('physicalSubstitution') / this.summarizedValues.physicalCapacity;
    this.summarizedValues.availableCapacity = this.sum('availableCapacity');
    this.summarizedValues.logicalUsed = this.sum('logicalUsed') / this.summarizedValues.physicalCapacity;
    this.summarizedValues.physicalUsed = this.sum('physicalUsed') / this.summarizedValues.physicalCapacity;
    this.summarizedValues.compressionRatio = this.sum('compressionRatio') / this.summarizedValues.physicalCapacity;

    console.log(this.partiallySummarizedValues)
    console.log(this.summarizedValues);
  }

  sum(statisticsName: string): number {
    return this.partiallySummarizedValues
      .reduce((previousValue, currentValue ) => {
        return previousValue + currentValue[statisticsName];
        }, 0 );
  }

  getSystemStatistics(systemName: string): SystemAggregatedStatistics {
    return this.partiallySummarizedValues.find(stats => stats.system === systemName);
  }

  getMetricByName(metrics: SystemMetric[], type: SystemMetricType) {
    const metric = metrics.find(item => item.type === type);
    if (metric === undefined) {
      return null;
    }
    return metric.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.computeSummaries();
  }

}
