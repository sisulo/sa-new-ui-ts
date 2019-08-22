import {SystemMetric} from '../../common/models/metrics/SystemMetric';
import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {ItemKey} from '../views/physical-capacity-statistics/physical-capacity-statistics.component';

class AggregatedStatistics {
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalUsed = 0;
  physicalUsed = 0;
  compressionRatio = 0;
  capacityChanged1D = 0;
  capacityChanged1W = 0;
  capacityChanged1M = 0;
}

export class SystemAggregatedStatistics extends AggregatedStatistics {
  system = null;
  subscriptionCapacity = 0;
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalCapacity = 0;
  logicalUsed = 0;
  logicalFree = 0;
  physicalUsedPerc = 0;
  physicalUsed = 0;
  physicalFree = 0;
  compressionRatio = 0;
  capacityChanged1D = 0;
  capacityChanged1W = 0;
  capacityChanged1M = 0;
  logicalSubstitution = 0;
  logicalUsedPerc = 0;
  netSubstitution = 0;
  netTotal = 0;
  netUsed = 0;
  netFree = 0;
  netUsedPerc = 0;
  dedupRatio = 0;
  totalSaving = 0;


  constructor(systemName: string) {
    super();
    this.system = systemName;
  }

  getValue(name: SystemMetricType) {
    switch (name) {
      case SystemMetricType.SUBSCRIBED_CAPACITY:
        return this.subscriptionCapacity;
      case SystemMetricType.PHYSICAL_SUBS_PERC:
        return this.physicalSubstitution;
      case SystemMetricType.LOGICAL_SUBS_PERC:
        return this.logicalSubstitution;
      case SystemMetricType.PHYSICAL_CAPACITY:
        return this.physicalCapacity;
      case SystemMetricType.LOGICAL_CAPACITY:
        return this.physicalCapacity;
      case SystemMetricType.AVAILABLE_CAPACITY:
        return this.availableCapacity;
      case SystemMetricType.LOGICAL_USED:
        return this.logicalUsed;
      case SystemMetricType.LOGICAL_FREE:
        return this.logicalFree;
      case SystemMetricType.PHYSICAL_USED:
        return this.physicalUsed;
      case SystemMetricType.PHYSICAL_FREE:
        return this.physicalFree;
      case SystemMetricType.PHYSICAL_USED_PERC:
        return this.physicalUsedPerc;
      case SystemMetricType.COMPRESS_RATIO:
        return this.compressionRatio;
      case SystemMetricType.CAPACITY_CHANGE_1D:
        return this.capacityChanged1D;
      case SystemMetricType.CAPACITY_CHANGE_1W:
        return this.capacityChanged1W;
      case SystemMetricType.CAPACITY_CHANGE_1M:
        return this.capacityChanged1M;
      case SystemMetricType.LOGICAL_USED_PERC:
        return this.logicalUsedPerc;
      case SystemMetricType.NET_SUBS_PERC:
        return this.netSubstitution;
      case SystemMetricType.NET_TOTAL:
        return this.netTotal;
      case SystemMetricType.NET_USED:
        return this.netUsed;
      case SystemMetricType.NET_FREE:
        return this.netFree;
      case SystemMetricType.NET_USED_PERC:
        return this.netUsedPerc;
      case SystemMetricType.DEDUP_RATIO:
        return this.dedupRatio;
      case SystemMetricType.TOTAL_SAVING_EFFECT:
        return this.totalSaving;
    }
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
        systemStats.subscriptionCapacity += this.getMetricByName(metrics, SystemMetricType.SUBSCRIBED_CAPACITY);
        systemStats.logicalCapacity += this.getMetricByName(metrics, SystemMetricType.LOGICAL_CAPACITY);
        systemStats.physicalSubstitution += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_SUBS_PERC) * physicalCapacity;
        systemStats.logicalSubstitution += this.getMetricByName(metrics, SystemMetricType.LOGICAL_SUBS_PERC) * physicalCapacity;
        systemStats.netSubstitution += this.getMetricByName(metrics, SystemMetricType.NET_SUBS_PERC) * physicalCapacity;
        systemStats.logicalUsedPerc += this.getMetricByName(metrics, SystemMetricType.LOGICAL_USED_PERC) * physicalCapacity;
        systemStats.availableCapacity += this.getMetricByName(metrics, SystemMetricType.AVAILABLE_CAPACITY);
        systemStats.logicalUsed += this.getMetricByName(metrics, SystemMetricType.LOGICAL_USED);
        systemStats.logicalFree += this.getMetricByName(metrics, SystemMetricType.LOGICAL_FREE);
        systemStats.physicalUsed += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_USED);
        systemStats.physicalFree += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_FREE);
        systemStats.physicalUsedPerc += this.getMetricByName(metrics, SystemMetricType.PHYSICAL_USED_PERC) * physicalCapacity;
        systemStats.compressionRatio += this.getMetricByName(metrics, SystemMetricType.COMPRESS_RATIO) * physicalCapacity;
        systemStats.capacityChanged1D += this.getMetricByName(metrics, SystemMetricType.CAPACITY_CHANGE_1D) * physicalCapacity;
        systemStats.capacityChanged1W += this.getMetricByName(metrics, SystemMetricType.CAPACITY_CHANGE_1W) * physicalCapacity;
        systemStats.capacityChanged1M += this.getMetricByName(metrics, SystemMetricType.CAPACITY_CHANGE_1M) * physicalCapacity;
        systemStats.netTotal += this.getMetricByName(metrics, SystemMetricType.NET_TOTAL);
        systemStats.netUsed += this.getMetricByName(metrics, SystemMetricType.NET_USED);
        systemStats.netFree += this.getMetricByName(metrics, SystemMetricType.NET_FREE);
        systemStats.netUsedPerc += this.getMetricByName(metrics, SystemMetricType.NET_USED_PERC) * physicalCapacity;
        systemStats.dedupRatio += this.getMetricByName(metrics, SystemMetricType.DEDUP_RATIO) * physicalCapacity;
        systemStats.totalSaving += this.getMetricByName(metrics, SystemMetricType.TOTAL_SAVING_EFFECT) * physicalCapacity;
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
    summarizedValues.subscriptionCapacity = this.sum(values, 'subscriptionCapacity');
    summarizedValues.logicalCapacity = this.sum(values, 'logicalCapacity');
    summarizedValues.physicalSubstitution = this.sum(values, 'physicalSubstitution') / summarizedValues.physicalCapacity;
    summarizedValues.logicalSubstitution = this.sum(values, 'logicalSubstitution') / summarizedValues.physicalCapacity;
    summarizedValues.netSubstitution = this.sum(values, 'netSubstitution') / summarizedValues.physicalCapacity;
    summarizedValues.logicalUsedPerc = this.sum(values, 'logicalUsedPerc') / summarizedValues.physicalCapacity;
    summarizedValues.availableCapacity = this.sum(values, 'availableCapacity');
    summarizedValues.logicalUsed = this.sum(values, 'logicalUsed');
    summarizedValues.logicalFree = this.sum(values, 'logicalFree');
    summarizedValues.physicalUsed = this.sum(values, 'physicalUsed');
    summarizedValues.physicalFree = this.sum(values, 'physicalFree');
    summarizedValues.physicalUsedPerc = this.sum(values, 'physicalUsedPerc') / summarizedValues.physicalCapacity;
    summarizedValues.compressionRatio = this.sum(values, 'compressionRatio') / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1D = this.sum(values, 'capacityChanged1D') / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1W = this.sum(values, 'capacityChanged1W') / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1M = this.sum(values, 'capacityChanged1M') / summarizedValues.physicalCapacity;
    summarizedValues.netTotal = this.sum(values, 'netTotal');
    summarizedValues.netUsed = this.sum(values, 'netUsed');
    summarizedValues.netFree = this.sum(values, 'netFree');
    summarizedValues.netUsedPerc = this.sum(values, 'netUsedPerc') / summarizedValues.physicalCapacity;
    summarizedValues.dedupRatio = this.sum(values, 'dedupRatio') / summarizedValues.physicalCapacity;
    summarizedValues.totalSaving = this.sum(values, 'totalSaving') / summarizedValues.physicalCapacity;
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
