import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SasiGroupRow, SasiRow, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {SelectedRow} from '../../common/components/sasi-table/row-table/row-table.component';
import {AggregatedValues, AggregateValueService} from '../../common/components/sasi-table/row-group-table/row-group-table.component';

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

  constructor(systemName: string) {
    this.system = systemName;
  }

  getValue(name: string): number {
    switch (name) {
      case SystemMetricType.PHYSICAL_SUBS:
        return this.physicalSubstitution;
      case SystemMetricType.PHYSICAL_CAPACITY:
        return this.physicalCapacity;
      case SystemMetricType.AVAILABLE_CAPACITY:
        return this.availableCapacity;
      case SystemMetricType.LOGICAL_USAGE:
        return this.logicalUsed;
      case SystemMetricType.PHYSICAL_USAGE:
        return this.physicalUsed;
      case SystemMetricType.COMPRESS_RATIO:
        return this.compressionRatio;
    }
  }
}

export class SasiWeightedArithmeticMean implements AggregateValueService {
  systemSummarizedValues: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();
  partiallySummarizedValues: SystemAggregatedStatistics = new SystemAggregatedStatistics('all');

  computeSummaries(inputRowGroup: SasiGroupRow[], filter: Array<SelectedRow>, options: SasiTableOptions): AggregatedValues {
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
    )
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
        systemStats.physicalSubstitution += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_SUBS) * physicalCapacity;
        systemStats.availableCapacity += this.getMetricByName(sasiRow, SystemMetricType.AVAILABLE_CAPACITY);
        systemStats.logicalUsed += this.getMetricByName(sasiRow, SystemMetricType.LOGICAL_USAGE) * physicalCapacity;
        systemStats.physicalUsed += this.getMetricByName(sasiRow, SystemMetricType.PHYSICAL_USAGE) * physicalCapacity;
        systemStats.compressionRatio += this.getMetricByName(sasiRow, SystemMetricType.COMPRESS_RATIO) * physicalCapacity;
      }
    );
    return this.summarizeStats(this.partiallySummarizedValues, 'all');
  }

  summarizeStats(values: SystemAggregatedStatistics, name: string): SystemAggregatedStatistics {
    const summarizedValues = new SystemAggregatedStatistics(name);
    summarizedValues.physicalCapacity = values.getValue(SystemMetricType.PHYSICAL_CAPACITY);
    summarizedValues.physicalSubstitution = values.getValue(SystemMetricType.PHYSICAL_SUBS) / summarizedValues.physicalCapacity;
    summarizedValues.availableCapacity = values.getValue(SystemMetricType.AVAILABLE_CAPACITY);
    summarizedValues.logicalUsed = values.getValue(SystemMetricType.LOGICAL_USAGE) / summarizedValues.physicalCapacity;
    summarizedValues.physicalUsed = values.getValue(SystemMetricType.PHYSICAL_USAGE) / summarizedValues.physicalCapacity;
    summarizedValues.compressionRatio = values.getValue(SystemMetricType.COMPRESS_RATIO) / summarizedValues.physicalCapacity;
    return summarizedValues;
  }

  sum(values: SystemAggregatedStatistics[], statisticsName: string): number {
    return values
      .reduce((previousValue, currentValue) => {
        return previousValue + currentValue[statisticsName];
      }, 0);
  }

  // getSystemStatistics(systemName: string): SystemAggregatedStatistics {
  //   return this.partiallySummarizedValues.find(stats => stats.system === systemName);
  // }

  getMetricByName(metrics: SasiRow, type: SystemMetricType): number {
    const metric = metrics.getCell(type);
    if (metric === undefined) {
      return null;
    }
    return Number(metric.value);
  }
}
