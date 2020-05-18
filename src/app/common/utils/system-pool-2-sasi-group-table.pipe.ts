import {Pipe, PipeTransform} from '@angular/core';
import {SasiCell, SasiGroupRow, SasiRow} from '../components/sasi-table/sasi-table.component';
import {SystemPool} from '../models/system-pool.vo';
import {SystemPool2SasiTablePipe} from './system-pool-2-sasi-table.pipe';
import {StorageEntityMetricDto} from '../models/dtos/storage-entity-metric.dto';

@Pipe({
  name: 'systemPool2SasiGroupTable'
})
export class SystemPool2SasiGroupTablePipe implements PipeTransform {

  constructor(private rowPipe: SystemPool2SasiTablePipe) {
  }

  transform(systems: StorageEntityMetricDto[], context?: string): SasiGroupRow[] {
    return systems.map(
      system => {
        const row = new SasiGroupRow();
        const groupRow = new SasiRow();
        groupRow.cells['name'] = new SasiCell(system.name, {id: system.name, iFrameLink: context, value: system.name});
        row.groupRow = groupRow;
        row.rows = this.rowPipe.transform(system.children, context, system.name);
        return row;
      }
    );
  }

}
