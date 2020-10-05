import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {SasiCell, SasiRow} from '../components/sasi-table/sasi-table.component';
import {SystemMetricType} from '../models/metrics/system-metric-type.enum';
import {StorageEntityMetricDto} from '../models/dtos/storage-entity-metric.dto';

// TODO move to the global statistics module
@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'parityGroup2SasiTable'
})
export class ParityGroup2SasiTablePipe implements PipeTransform {

  transform(pools: StorageEntityMetricDto[], context: string, linkId?: string): SasiRow[] {
    const rows = [];
    pools.forEach(
      pool => {
        let linkIdInput = pool.name;
        if (linkId != null) {
          linkIdInput = linkId;
        }
        if (pool.children !== undefined && pool.children.length > 0) {
          this.transformParityGroups(pool.children, pool.name, null, null).forEach(row => rows.push(row));
        }
      }
    );
    return rows;
  }

  transformParityGroups(parityGroups: StorageEntityMetricDto[], poolName: string, context: string, linkId?: string): SasiRow[] {
    const rows: SasiRow[] = [];
    parityGroups.forEach(parityGroup => {
      if (parityGroup.metrics !== undefined) {
        parityGroup.metrics.forEach(metric => {

          const row = new SasiRow();
          row.cells['poolName'] = new SasiCell(poolName, {id: poolName, iFrameLink: 'pools', value: poolName});
          row.cells['name'] = new SasiCell(parityGroup.name, {id: poolName, iFrameLink: 'parityGroups', value: parityGroup.name});
          row.cells[SystemMetricType.HDD] = new SasiCell(metric.value, metric);
          row.cells[SystemMetricType.DURATION] = new SasiCell(metric.startTime, metric);
          row.cells['date'] = new SasiCell(metric.startTime, metric);
          row.cells['timeInterval'] = new SasiCell(metric.startTime, metric);
          rows.push(row);
        });
      }


    });
    return rows;
  }

}
