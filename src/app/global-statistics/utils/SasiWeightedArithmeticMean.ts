import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SasiGroupRow, SasiRow, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {AggregatedValues, AggregateValueService} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SelectedRow} from '../../common/components/sasi-table/row-table/selected-row';

// class AggregatedStatistics implements AggregatedValues {
//   physicalSubstitution = 0;
//   physicalCapacity = 0;
//   availableCapacity = 0;
//   logicalUsed = 0;
//   physicalUsedPerc = 0;
//   compressionRatio = 0;
// }

export class SystemAggregatedStatistics implements AggregatedValues {
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
    this.system = systemName;
  }

  getValue(name: string): number {
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

export class SasiWeightedArithmeticMean implements AggregateValueService {
  systemSummarizedValues: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();
  partiallySummarizedValues: SystemAggregatedStatistics = new SystemAggregatedStatistics('all');

  computeSummaries(inputRowGroup: SasiGroupRow[], filter: Array<SelectedRow>, options: SasiTableOptions): AggregatedValues {
    console.log('compute');
    if (filter.length === 0) {
      return null;
    }
    this.systemSummarizedValues = new Array<SystemAggregatedStatistics>();
    this.partiallySummarizedValues = new SystemAggregatedStatistics('');
    const amendFilter = filter.filter(
      key => {
        const rowGroup = inputRowGroup.find(row => row.groupRow.getCell('name').value === key.groupName);
        if (rowGroup === undefined) {
          return null;
        }
        // Todo should be some configuration for Unique id column
        const sasiRow: SasiRow = rowGroup.rows.find(row => row.getCell('name').value === key.rowName);
        if (sasiRow === undefined) {
          return null;
        }
        return true;
      }
    );
    if (amendFilter.length === 0) {
      return null;
    }
    amendFilter.forEach(
      key => {
        const rowGroup = inputRowGroup.find(row => row.groupRow.getCell('name').value === key.groupName);
        if (rowGroup === undefined) {
          return null;
        }
        // Todo should be some configuration for Unique id column
        const sasiRow: SasiRow = rowGroup.rows.find(row => row.getCell('name').value === key.rowName);
        if (sasiRow === undefined) {
          return null;
        }
        const systemStats = this.partiallySummarizedValues;
        const physicalCapacity = this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_CAPACITY);
        systemStats.physicalCapacity += physicalCapacity;
        systemStats.subscriptionCapacity += this.getMetricByName(sasiRow, SystemMetricType.SUBSCRIBED_CAPACITY);
        systemStats.logicalCapacity += this.getMetricByName(sasiRow, SystemMetricType.LOGICAL_CAPACITY);
        systemStats.physicalSubstitution += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_SUBS_PERC) * physicalCapacity;
        systemStats.logicalSubstitution += this.getMetricByName(sasiRow, SystemMetricType.LOGICAL_SUBS_PERC) * physicalCapacity;
        systemStats.netSubstitution += this.getMetricByName(sasiRow, SystemMetricType.NET_SUBS_PERC) * physicalCapacity;
        systemStats.logicalUsedPerc += this.getMetricByName(sasiRow, SystemMetricType.LOGICAL_USED_PERC) * physicalCapacity;
        systemStats.availableCapacity += this.getMetricByName(sasiRow, SystemMetricType.AVAILABLE_CAPACITY);
        systemStats.logicalUsed += this.getMetricByName(sasiRow, SystemMetricType.LOGICAL_USED);
        systemStats.logicalFree += this.getMetricByName(sasiRow, SystemMetricType.LOGICAL_FREE);
        systemStats.physicalUsed += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_USED);
        systemStats.physicalFree += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_FREE);
        systemStats.physicalUsedPerc += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_USED_PERC) * physicalCapacity;
        systemStats.compressionRatio += this.getMetricByName(sasiRow, SystemMetricType.COMPRESS_RATIO) * physicalCapacity;
        systemStats.capacityChanged1D += this.getMetricByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1D) * physicalCapacity;
        systemStats.capacityChanged1W += this.getMetricByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1W) * physicalCapacity;
        systemStats.capacityChanged1M += this.getMetricByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1M) * physicalCapacity;
        systemStats.netTotal += this.getMetricByName(sasiRow, SystemMetricType.NET_TOTAL);
        systemStats.netUsed += this.getMetricByName(sasiRow, SystemMetricType.NET_USED);
        systemStats.netFree += this.getMetricByName(sasiRow, SystemMetricType.NET_FREE);
        systemStats.netUsedPerc += this.getMetricByName(sasiRow, SystemMetricType.NET_USED_PERC) * physicalCapacity;
        systemStats.dedupRatio += this.getMetricByName(sasiRow, SystemMetricType.DEDUP_RATIO) * physicalCapacity;
        systemStats.totalSaving += this.getMetricByName(sasiRow, SystemMetricType.TOTAL_SAVING_EFFECT) * physicalCapacity;
      }
    );
    return this.summarizeStats(this.partiallySummarizedValues, 'all');
  }

  summarizeStats(values: SystemAggregatedStatistics, name: string): SystemAggregatedStatistics {
    const summarizedValues = new SystemAggregatedStatistics(name);
    summarizedValues.subscriptionCapacity = values.getValue(SystemMetricType.SUBSCRIBED_CAPACITY);
    summarizedValues.physicalCapacity = values.getValue(SystemMetricType.PHYSICAL_CAPACITY);
    summarizedValues.logicalCapacity = values.getValue(SystemMetricType.LOGICAL_CAPACITY);
    summarizedValues.physicalSubstitution = values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.logicalSubstitution = values.getValue(SystemMetricType.LOGICAL_SUBS_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.netSubstitution = values.getValue(SystemMetricType.NET_SUBS_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.logicalUsedPerc = values.getValue(SystemMetricType.LOGICAL_USED_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.availableCapacity = values.getValue(SystemMetricType.AVAILABLE_CAPACITY);
    summarizedValues.logicalUsed = values.getValue(SystemMetricType.LOGICAL_USED);
    summarizedValues.logicalFree = values.getValue(SystemMetricType.LOGICAL_FREE);
    summarizedValues.physicalUsed = values.getValue(SystemMetricType.PHYSICAL_USED);
    summarizedValues.physicalFree = values.getValue(SystemMetricType.PHYSICAL_FREE);
    summarizedValues.physicalUsedPerc = values.getValue(SystemMetricType.PHYSICAL_USED_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.compressionRatio = values.getValue(SystemMetricType.COMPRESS_RATIO) / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1D = values.getValue(SystemMetricType.CAPACITY_CHANGE_1D) / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1W = values.getValue(SystemMetricType.CAPACITY_CHANGE_1W) / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1M = values.getValue(SystemMetricType.CAPACITY_CHANGE_1M) / summarizedValues.physicalCapacity;
    summarizedValues.netTotal = values.getValue(SystemMetricType.NET_TOTAL);
    summarizedValues.netUsed = values.getValue(SystemMetricType.NET_USED);
    summarizedValues.netFree = values.getValue(SystemMetricType.NET_FREE);
    summarizedValues.netUsedPerc = values.getValue(SystemMetricType.NET_USED_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.dedupRatio = values.getValue(SystemMetricType.DEDUP_RATIO) / summarizedValues.physicalCapacity;
    summarizedValues.totalSaving = values.getValue(SystemMetricType.TOTAL_SAVING_EFFECT) / summarizedValues.physicalCapacity;
    return summarizedValues;
  }

  getMetricByName(metrics: SasiRow, type: SystemMetricType): number {
    const metric = metrics.getCell(type);
    if (metric === null) {
      return null;
    }
    return Number(metric.value);
  }
}
