import {Component, OnInit} from '@angular/core';
import {AggregatedValues} from '../../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SystemMetricType} from '../../../common/models/metrics/SystemMetricType';
import {MetricService} from '../../../metric.service';
import {SystemPool2SasiGroupTablePipe} from '../../../common/utils/system-pool-2-sasi-group-table.pipe';
import {SasiWeightedArithmeticMean} from '../../utils/SasiWeightedArithmeticMean';
import {SelectedRow} from '../../../common/components/sasi-table/row-table/selected-row';
import {CommonAggregatedStats} from './global-physical-capacity-statistics.component';

@Component({
  selector: 'app-global-host-group-capacity',
  templateUrl: './aggragated-statistics.component.html',
  styleUrls: ['./aggragated-statistics.component.css']
})
export class GlobalHostGroupCapacityComponent extends CommonAggregatedStats implements OnInit {

  constructor(protected metricService: MetricService,
              protected transformer: SystemPool2SasiGroupTablePipe) {
    super();
    this.aggregatedTypes = [
      SystemMetricType.NET_TOTAL,
      SystemMetricType.NET_USED,
      SystemMetricType.NET_USED_PERC,
      SystemMetricType.CAPACITY_CHANGE_1D,
      SystemMetricType.CAPACITY_CHANGE_1W,
      SystemMetricType.CAPACITY_CHANGE_1M
    ];

    this.labels[SystemMetricType.NET_TOTAL] = 'Provisioned Capacity';
    this.labels[SystemMetricType.NET_USED] = 'Used Capacity';
    this.labels[SystemMetricType.NET_USED_PERC] = 'Used Capacity';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1D] = 'Last Day Change';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1W] = 'Last Week Change';
    this.labels[SystemMetricType.CAPACITY_CHANGE_1M] = 'Last Month Change';
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData(): AggregatedValues { // TODO duplicated for all GS sasi tables
    this.metricService.getGlobalHostGroupCapacityStatistics().subscribe(
      data => {
        const average = new SasiWeightedArithmeticMean();
        const filter: SelectedRow[] = [];
        data.systems.forEach(
          system => system.pools.forEach(
            pool => {
              const row = new SelectedRow(system.name, pool.name);
              filter.push(row);
            }));
        this.result = average.computeSummaries(this.transformer.transform(data.systems, ''), filter);
      },
      error => {
        console.log(error);
        this.result = null;
      }
    );
    return this.result;
  }

}
