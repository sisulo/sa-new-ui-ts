import {SystemMetricType} from '../../common/models/metrics/SystemMetricType';
import {SasiCell, SasiGroupRow, SasiRow} from '../../common/components/sasi-table/sasi-table.component';
import {AggregatedValues, AggregateValueService} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SelectedRow} from '../../common/components/sasi-table/row-table/selected-row';
import {Metric} from '../../common/models/metrics/Metric';

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
  values: Metric[] = [];

  constructor(systemName: string) {
    this.system = systemName;
  }

  getValue(name: string): Metric {
    return this.values[name];
  }

  setMetric(type, value) {
    this.values[type] = value;
  }

  setValue(type, value, unit: string) {
    if (this.values[type] === undefined) {
      const metric = new Metric();
      metric.type = type;
      metric.unit = unit;
      metric.value = 0;
      this.setMetric(type, metric);
    }
    this.values[type].value += value;
  }
}

export class SasiWeightedArithmeticMean implements AggregateValueService {
  systemSummarizedValues: SystemAggregatedStatistics[] = new Array<SystemAggregatedStatistics>();
  partiallySummarizedValues: SystemAggregatedStatistics = new SystemAggregatedStatistics('all');
  physicalCapacityCompRatio = 0;
  physicalCapacityDedupRatio = 0;
  physicalCapacityTotalSaving = 0;

  computeSummaries(inputRowGroup: SasiGroupRow[], filter: Array<SelectedRow>): AggregatedValues {
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
        const physicalCapacity = this.getMetricValueByName(sasiRow, SystemMetricType.PHYSICAL_CAPACITY);
        // systemStats.physicalCapacity += physicalCapacity;
        this.partiallySummarizedValues.setValue(
          SystemMetricType.PHYSICAL_CAPACITY,
          this.getMetricValueByName(sasiRow, SystemMetricType.PHYSICAL_CAPACITY),
          this.getUnitByName(sasiRow, SystemMetricType.PHYSICAL_CAPACITY))
        ;
        this.partiallySummarizedValues.setValue(SystemMetricType.SUBSCRIBED_CAPACITY, this.getMetricValueByName(sasiRow, SystemMetricType.SUBSCRIBED_CAPACITY), this.getUnitByName(sasiRow, SystemMetricType.SUBSCRIBED_CAPACITY));
        this.partiallySummarizedValues.setValue(SystemMetricType.LOGICAL_CAPACITY, this.getMetricValueByName(sasiRow, SystemMetricType.LOGICAL_CAPACITY), this.getUnitByName(sasiRow, SystemMetricType.LOGICAL_CAPACITY));
        this.partiallySummarizedValues.setValue(SystemMetricType.AVAILABLE_CAPACITY, this.getMetricValueByName(sasiRow, SystemMetricType.AVAILABLE_CAPACITY), this.getUnitByName(sasiRow, SystemMetricType.AVAILABLE_CAPACITY));
        this.partiallySummarizedValues.setValue(SystemMetricType.LOGICAL_USED, this.getMetricValueByName(sasiRow, SystemMetricType.LOGICAL_USED), this.getUnitByName(sasiRow, SystemMetricType.LOGICAL_USED));
        this.partiallySummarizedValues.setValue(SystemMetricType.LOGICAL_FREE, this.getMetricValueByName(sasiRow, SystemMetricType.LOGICAL_FREE), this.getUnitByName(sasiRow, SystemMetricType.LOGICAL_FREE));
        this.partiallySummarizedValues.setValue(SystemMetricType.PHYSICAL_USED, this.getMetricValueByName(sasiRow, SystemMetricType.PHYSICAL_USED), this.getUnitByName(sasiRow, SystemMetricType.PHYSICAL_USED));
        this.partiallySummarizedValues.setValue(SystemMetricType.PHYSICAL_FREE, this.getMetricValueByName(sasiRow, SystemMetricType.PHYSICAL_FREE), this.getUnitByName(sasiRow, SystemMetricType.PHYSICAL_FREE));
        this.partiallySummarizedValues.setValue(SystemMetricType.NET_TOTAL, this.getMetricValueByName(sasiRow, SystemMetricType.NET_TOTAL), this.getUnitByName(sasiRow, SystemMetricType.NET_TOTAL));
        this.partiallySummarizedValues.setValue(SystemMetricType.NET_USED, this.getMetricValueByName(sasiRow, SystemMetricType.NET_USED), this.getUnitByName(sasiRow, SystemMetricType.NET_USED));
        this.partiallySummarizedValues.setValue(SystemMetricType.NET_FREE, this.getMetricValueByName(sasiRow, SystemMetricType.NET_FREE), this.getUnitByName(sasiRow, SystemMetricType.NET_FREE));
        this.partiallySummarizedValues.setValue(SystemMetricType.PHYSICAL_SUBS_PERC, this.getMetricValueByName(sasiRow, SystemMetricType.PHYSICAL_SUBS_PERC) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.PHYSICAL_SUBS_PERC));
        this.partiallySummarizedValues.setValue(SystemMetricType.LOGICAL_SUBS_PERC, this.getMetricValueByName(sasiRow, SystemMetricType.LOGICAL_SUBS_PERC) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.LOGICAL_SUBS_PERC));
        this.partiallySummarizedValues.setValue(SystemMetricType.NET_SUBS_PERC, this.getMetricValueByName(sasiRow, SystemMetricType.NET_SUBS_PERC) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.NET_SUBS_PERC));
        this.partiallySummarizedValues.setValue(SystemMetricType.LOGICAL_USED_PERC, this.getMetricValueByName(sasiRow, SystemMetricType.LOGICAL_USED_PERC) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.LOGICAL_USED_PERC));
        this.partiallySummarizedValues.setValue(SystemMetricType.PHYSICAL_USED_PERC, this.getMetricValueByName(sasiRow, SystemMetricType.PHYSICAL_USED_PERC) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.PHYSICAL_USED_PERC));
        this.partiallySummarizedValues.setValue(SystemMetricType.NET_USED_PERC, this.getMetricValueByName(sasiRow, SystemMetricType.NET_USED_PERC) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.NET_USED_PERC));
        const compRatio = this.getMetricValueByName(sasiRow, SystemMetricType.COMPRESS_RATIO);
        this.partiallySummarizedValues.setValue(SystemMetricType.COMPRESS_RATIO, compRatio * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.COMPRESS_RATIO));
        if (compRatio > 0) {
          this.physicalCapacityCompRatio += physicalCapacity;
        }
        this.partiallySummarizedValues.setValue(SystemMetricType.CAPACITY_CHANGE_1D, this.getMetricValueByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1D) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1D));
        this.partiallySummarizedValues.setValue(SystemMetricType.CAPACITY_CHANGE_1W, this.getMetricValueByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1W) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1W));
        this.partiallySummarizedValues.setValue(SystemMetricType.CAPACITY_CHANGE_1M, this.getMetricValueByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1M) * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.CAPACITY_CHANGE_1M));
        const dedupRatio = this.getMetricValueByName(sasiRow, SystemMetricType.DEDUP_RATIO);
        this.partiallySummarizedValues.setValue(SystemMetricType.DEDUP_RATIO, dedupRatio * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.DEDUP_RATIO));
        if (dedupRatio > 0) {
          this.physicalCapacityDedupRatio += physicalCapacity;
        }
        const totalSaving = this.getMetricValueByName(sasiRow, SystemMetricType.TOTAL_SAVING_EFFECT);
        this.partiallySummarizedValues.setValue(SystemMetricType.TOTAL_SAVING_EFFECT, totalSaving * physicalCapacity, this.getUnitByName(sasiRow, SystemMetricType.TOTAL_SAVING_EFFECT));
        if (totalSaving > 0) {
          this.physicalCapacityTotalSaving += physicalCapacity;
        }
      }
    );
    return this.summarizeStats(this.partiallySummarizedValues, 'all');
  }

  summarizeStats(values: SystemAggregatedStatistics, name: string): SystemAggregatedStatistics {
    const summarizedValues = new SystemAggregatedStatistics(name);
    summarizedValues.setValue(SystemMetricType.SUBSCRIBED_CAPACITY, values.getValue(SystemMetricType.SUBSCRIBED_CAPACITY).value, values.getValue(SystemMetricType.SUBSCRIBED_CAPACITY).unit);
    summarizedValues.setValue(SystemMetricType.PHYSICAL_CAPACITY, values.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.PHYSICAL_CAPACITY).unit);
    summarizedValues.setValue(SystemMetricType.LOGICAL_CAPACITY, values.getValue(SystemMetricType.LOGICAL_CAPACITY).value, values.getValue(SystemMetricType.LOGICAL_CAPACITY).unit);
    summarizedValues.setValue(SystemMetricType.AVAILABLE_CAPACITY, values.getValue(SystemMetricType.AVAILABLE_CAPACITY).value, values.getValue(SystemMetricType.AVAILABLE_CAPACITY).unit);
    summarizedValues.setValue(SystemMetricType.LOGICAL_USED, values.getValue(SystemMetricType.LOGICAL_USED).value, values.getValue(SystemMetricType.LOGICAL_USED).unit);
    summarizedValues.setValue(SystemMetricType.LOGICAL_FREE, values.getValue(SystemMetricType.LOGICAL_FREE).value, values.getValue(SystemMetricType.LOGICAL_FREE).unit);
    summarizedValues.setValue(SystemMetricType.PHYSICAL_USED, values.getValue(SystemMetricType.PHYSICAL_USED).value, values.getValue(SystemMetricType.PHYSICAL_USED).unit);
    summarizedValues.setValue(SystemMetricType.PHYSICAL_FREE, values.getValue(SystemMetricType.PHYSICAL_FREE).value, values.getValue(SystemMetricType.PHYSICAL_FREE).unit);
    summarizedValues.setValue(SystemMetricType.NET_TOTAL, values.getValue(SystemMetricType.NET_TOTAL).value, values.getValue(SystemMetricType.NET_TOTAL).unit);
    summarizedValues.setValue(SystemMetricType.NET_USED, values.getValue(SystemMetricType.NET_USED).value, values.getValue(SystemMetricType.NET_USED).unit);
    summarizedValues.setValue(SystemMetricType.NET_FREE, values.getValue(SystemMetricType.NET_FREE).value, values.getValue(SystemMetricType.NET_FREE).unit);
    summarizedValues.setValue(SystemMetricType.PHYSICAL_SUBS_PERC, values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC).unit);
    summarizedValues.setValue(SystemMetricType.LOGICAL_SUBS_PERC, values.getValue(SystemMetricType.LOGICAL_SUBS_PERC).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC).unit);
    summarizedValues.setValue(SystemMetricType.NET_SUBS_PERC, values.getValue(SystemMetricType.NET_SUBS_PERC).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC).unit);
    summarizedValues.setValue(SystemMetricType.LOGICAL_USED_PERC, values.getValue(SystemMetricType.LOGICAL_USED_PERC).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC).unit);
    summarizedValues.setValue(SystemMetricType.PHYSICAL_USED_PERC, values.getValue(SystemMetricType.PHYSICAL_USED_PERC).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.PHYSICAL_SUBS_PERC).unit);
    summarizedValues.setValue(SystemMetricType.NET_USED_PERC, values.getValue(SystemMetricType.NET_USED_PERC).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.NET_USED_PERC).unit);
    summarizedValues.setValue(SystemMetricType.CAPACITY_CHANGE_1D, values.getValue(SystemMetricType.CAPACITY_CHANGE_1D).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.CAPACITY_CHANGE_1D).unit);
    summarizedValues.setValue(SystemMetricType.CAPACITY_CHANGE_1W, values.getValue(SystemMetricType.CAPACITY_CHANGE_1W).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.CAPACITY_CHANGE_1W).unit);
    summarizedValues.setValue(SystemMetricType.CAPACITY_CHANGE_1M, values.getValue(SystemMetricType.CAPACITY_CHANGE_1M).value / summarizedValues.getValue(SystemMetricType.PHYSICAL_CAPACITY).value, values.getValue(SystemMetricType.CAPACITY_CHANGE_1M).unit);
    summarizedValues.setValue(SystemMetricType.COMPRESS_RATIO, values.getValue(SystemMetricType.COMPRESS_RATIO).value / (this.physicalCapacityCompRatio === 0 ? 1 : this.physicalCapacityCompRatio), values.getValue(SystemMetricType.COMPRESS_RATIO).unit);
    summarizedValues.setValue(SystemMetricType.DEDUP_RATIO, values.getValue(SystemMetricType.DEDUP_RATIO).value / (this.physicalCapacityDedupRatio === 0 ? 1 : this.physicalCapacityDedupRatio), values.getValue(SystemMetricType.DEDUP_RATIO).unit);
    summarizedValues.setValue(SystemMetricType.TOTAL_SAVING_EFFECT, values.getValue(SystemMetricType.TOTAL_SAVING_EFFECT).value / (this.physicalCapacityTotalSaving === 0 ? 1 : this.physicalCapacityTotalSaving), values.getValue(SystemMetricType.TOTAL_SAVING_EFFECT).unit);
    return summarizedValues;
  }

  getMetricByName(metrics: SasiRow, type: SystemMetricType): SasiCell {
    const metric = metrics.getCell(type);
    if (metric === null) {
      return null;
    }
    return metric;
  }

  getMetricValueByName(metrics: SasiRow, type: SystemMetricType) {
    const metric = this.getMetricByName(metrics, type);
    if (metric == null) {
      return null;
    }
    return Number(metric.value);
  }

  getUnitByName(metrics: SasiRow, type: SystemMetricType) {
    const metric = this.getMetricByName(metrics, type);
    if (metric == null || metric.rawData == null) {
      return null;
    }
    return metric.rawData.unit;
  }


}
