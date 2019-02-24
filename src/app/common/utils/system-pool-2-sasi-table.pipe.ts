import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {SystemDetail} from '../models/SystemDetail';
import {SasiCell, SasiRow} from '../components/sasi-table/sasi-table.component';
// TODO move to the global statistics module
@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'systemPool2SasiTable'
})
export class SystemPool2SasiTablePipe implements PipeTransform {

  transform(systems: SystemDetail[], args?: any): SasiRow[] {
    return systems.map(
      system => {
        const row = new SasiRow();
        row.cells['name'] = new SasiCell(system.name, {id: system.id, iFrameLink: 'dashboard', name: system.name});
        system.metrics.forEach(
          metric => row.cells[metric.type] = new SasiCell(metric.value, metric)
        );
        return row;
      }
    );
  }

}
