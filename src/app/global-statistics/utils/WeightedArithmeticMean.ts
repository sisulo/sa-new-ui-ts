import {SystemMetric} from '../../models/metrics/SystemMetric';
import {SystemMetricType} from '../../models/metrics/SystemMetricType';
import {ItemKey} from '../capacity-statistics/capacity-statistics.component';

class AggregatedStatistics {
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalUsed = 0;
  physicalUsed = 0;
  compressionRatio = 0;
}

export class SystemAggregatedStatistics extends AggregatedStatistics {
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

export class WeightedArithmeticMean {
  systemSummarizedValues: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();
  partiallySummarizedValues: SystemAggregatedStatistics[] = [];

  computeSummaries(inputMetrics: {}, filter: Array<ItemKey>): SystemAggregatedStatistics[] {
    if (filter.length === 0) {
      return [];
    }
    this.systemSummarizedValues = new Array<SystemAggregatedStatistics>();
    this.partiallySummarizedValues = [];
    filter.forEach(
      key => {
        const metrics: SystemMetric[] = inputMetrics[key.poolName];
        let systemStats = this.getSystemStatistics(key.systemName);
        if (systemStats === undefined) {
          systemStats = new SystemAggregatedStatistics(key.systemName);
          this.partiallySummarizedValues.push(systemStats);
        }
        const physicalCapacity = this.getMetricByName(metrics, SystemMetricType.PHYSICAL_CAPACITY);
        systemStats.physicalCapacity += physicalCapacity;
        systemStats.physicalSubstitution += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_SUBS) * physicalCapacity;
        systemStats.availableCapacity += this.getMetricByName(metrics, SystemMetricType.AVAILABLE_CAPACITY);
        systemStats.logicalUsed += this.getMetricByName(metrics, SystemMetricType.LOGICAL_USAGE) * physicalCapacity;
        systemStats.physicalUsed += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_USAGE) * physicalCapacity;
        systemStats.compressionRatio += this.getMetricByName(metrics, SystemMetricType.COMPRESS_RATIO) * physicalCapacity;
      }
    );
    filter.forEach(
      key => {
        const systemStats = this.getSystemStatistics(key.systemName);
        if (systemStats === undefined) {
          return;
        }
        this.systemSummarizedValues.push(this.summarizeStats([systemStats], key.systemName));
      }
    );
    this.systemSummarizedValues.push(this.summarizeStats(this.partiallySummarizedValues, 'all'));
    return this.systemSummarizedValues;
  }

  summarizeStats(values: SystemAggregatedStatistics[], name: string): SystemAggregatedStatistics {
    const summarizedValues = new SystemAggregatedStatistics(name);
    summarizedValues.physicalCapacity = this.sum(values, 'physicalCapacity');
    summarizedValues.physicalSubstitution = this.sum(values, 'physicalSubstitution') / summarizedValues.physicalCapacity;
    summarizedValues.availableCapacity = this.sum(values, 'availableCapacity');
    summarizedValues.logicalUsed = this.sum(values, 'logicalUsed') / summarizedValues.physicalCapacity;
    summarizedValues.physicalUsed = this.sum(values, 'physicalUsed') / summarizedValues.physicalCapacity;
    summarizedValues.compressionRatio = this.sum(values, 'compressionRatio') / summarizedValues.physicalCapacity;
    return summarizedValues;
  }

  sum(values: SystemAggregatedStatistics[], statisticsName: string): number {
    return values
      .reduce((previousValue, currentValue) => {
        return previousValue + currentValue[statisticsName];
      }, 0);
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
}
