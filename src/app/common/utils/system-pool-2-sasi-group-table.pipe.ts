import {Pipe, PipeTransform} from '@angular/core';
import {SasiCell, SasiGroupRow, SasiRow} from '../components/sasi-table/sasi-table.component';
import {SystemPool} from '../models/SystemPool';
import {SystemPool2SasiTablePipe} from './system-pool-2-sasi-table.pipe';

@Pipe({
  name: 'systemPool2SasiGroupTable'
})
export class SystemPool2SasiGroupTablePipe implements PipeTransform {

  constructor(private rowPipe: SystemPool2SasiTablePipe) {
  }

  transform(systems: SystemPool[], args?: any): SasiGroupRow[] {
    return systems.map(
      system => {
        const row = new SasiGroupRow();
        const groupRow = new SasiRow();
        groupRow.cells['name'] = new SasiCell(system.name, {id: system.id, iFrameLink: 'dashboard', name: system.name});
        row.groupRow = groupRow;
        row.rows = this.rowPipe.transform(system.pools);
        return row;
      }
    );
  }

}
