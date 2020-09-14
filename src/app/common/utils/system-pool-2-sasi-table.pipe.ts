import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {SasiCell, SasiRow} from '../components/sasi-table/sasi-table.component';
import {SystemMetricType} from '../models/metrics/system-metric-type.enum';
import {Metric} from '../models/metrics/metric.vo';
import {StorageEntityMetricDto} from '../models/dtos/storage-entity-metric.dto';

// TODO move to the global statistics module
@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'systemPool2SasiTable'
})
export class SystemPool2SasiTablePipe implements PipeTransform {

  transform(systems: StorageEntityMetricDto[], context: string, linkId?: string): SasiRow[] {
    return systems.map(
      system => {
        const row = new SasiRow();
        let linkIdInput = system.name;
        if (linkId != null) {
          linkIdInput = linkId;
        }
        row.cells['name'] = new SasiCell(system.name, {id: linkIdInput, iFrameLink: context, value: system.name});
        if (system.metrics !== undefined) {
          system.metrics.forEach(
            metric => row.cells[metric.type] = new SasiCell(metric.value, metric)
          );
        }
        if (system.children !== undefined && system.children.length > 0) {
          row.subRows = this.transform(system.children, null, null);
          const metric = new Metric();
          metric.value = this.countPortImbalances(row.subRows);
          metric.type = SystemMetricType.PORT_IMBALANCE_EVENTS;
          row.cells[SystemMetricType.PORT_IMBALANCE_EVENTS] = new SasiCell(metric.value, metric);
        }
        if (system.detail !== undefined) {
          row.cells['sortId'] = new SasiCell(system.detail.sortId, {
            id: system.detail.sortId,
            iFrameLink: context,
            value: system.detail.sortId
          });
        }
        if (system.externals !== undefined) {
          row.externals = system.externals;
        }
        return row;
      }
    );
  }

  countPortImbalances(rows: SasiRow[]): number {
    return rows.filter(row => parseInt(row.getCell(SystemMetricType.PORT_IMBALANCE_EVENTS).value, 10) > 0).length;
  }

}
