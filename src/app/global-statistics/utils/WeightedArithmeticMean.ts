import {SystemMetricType} from '../../common/models/metrics/system-metric-type.enum';

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
