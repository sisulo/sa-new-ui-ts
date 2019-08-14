import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SasiGroupRow, SasiRow, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {AggregatedValues, AggregateValueService} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SelectedRow} from '../../common/components/sasi-table/row-table/selected-row';

// class AggregatedStatistics implements AggregatedValues {
//   physicalSubstitution = 0;
//   physicalCapacity = 0;
//   availableCapacity = 0;
//   logicalUsed = 0;
//   physicalUsed = 0;
//   compressionRatio = 0;
// }

export class SystemAggregatedStatistics implements AggregatedValues {
  system = null;
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalUsed = 0;
  physicalUsed = 0;
  compressionRatio = 0;
  capacityChanged1D = 0;
  capacityChanged1W = 0;
  capacityChanged1M = 0;

  constructor(systemName: string) {
    this.system = systemName;
  }

  getValue(name: string): number {
    switch (name) {
      case SystemMetricType.PHYSICAL_SUBS_PERC:
        return this.physicalSubstitution;
      case SystemMetricType.PHYSICAL_CAPACITY:
        return this.physicalCapacity;
      case SystemMetricType.AVAILABLE_CAPACITY:
        return this.availableCapacity;
      case SystemMetricType.LOGICAL_USED_PERC:
        return this.logicalUsed;
      case SystemMetricType.PHYSICAL_USED_PERC:
        return this.physicalUsed;
      case SystemMetricType.COMPRESS_RATIO:
        return this.compressionRatio;
      case SystemMetricType.CAPACITY_CHANGE_1D:
        return this.capacityChanged1D;
      case SystemMetricType.CAPACITY_CHANGE_1W:
        return this.capacityChanged1W;
      case SystemMetricType.CAPACITY_CHANGE_1M:
        return this.capacityChanged1M;
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
        systemStats.physicalSubstitution += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_SUBS_PERC) * physicalCapacity;
        systemStats.availableCapacity += this.getMetricByName(sasiRow, SystemMetricType.AVAILABLE_CAPACITY);
        systemStats.logicalUsed += this.getMetricByName(sasiRow, SystemMetricType.LOGICAL_USED_PERC) * physicalCapacity;
        systemStats.physicalUsed += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_USED_PERC) * physicalCapacity;
        systemStats.compressionRatio += this.getMetricByName(sasiRow, SystemMetricType.COMPRESS_RATIO) * physicalCapacity;
        systemStats.capacityChanged1D += this.getMetricByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1D) * physicalCapacity;
        systemStats.capacityChanged1W += this.getMetricByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1W) * physicalCapacity;
        systemStats.capacityChanged1M += this.getMetricByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1M) * physicalCapacity;
      }
    );
    return this.summarizeStats(this.partiallySummarizedValues, 'all');
  }

  summarizeStats(values: SystemAggregatedStatistics, name: string): SystemAggregatedStatistics {
    const summarizedValues = new SystemAggregatedStatistics(name);
    summarizedValues.physicalCapacity = values.getValue(SystemMetricType.PHYSICAL_CAPACITY);
    summarizedValues.physicalSubstitution = values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.availableCapacity = values.getValue(SystemMetricType.AVAILABLE_CAPACITY);
    summarizedValues.logicalUsed = values.getValue(SystemMetricType.LOGICAL_USED_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.physicalUsed = values.getValue(SystemMetricType.PHYSICAL_USED_PERC) / summarizedValues.physicalCapacity;
    summarizedValues.compressionRatio = values.getValue(SystemMetricType.COMPRESS_RATIO) / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1D = values.getValue(SystemMetricType.CAPACITY_CHANGE_1D) / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1W = values.getValue(SystemMetricType.CAPACITY_CHANGE_1W) / summarizedValues.physicalCapacity;
    summarizedValues.capacityChanged1M = values.getValue(SystemMetricType.CAPACITY_CHANGE_1M) / summarizedValues.physicalCapacity;
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
