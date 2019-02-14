import {Pipe, PipeTransform} from '@angular/core';
import {SystemDetail} from '../models/SystemDetail';
import {SasiCell} from '../components/sasi-table/sasi-table.component';

@Pipe({
  name: 'systemPool2SasiTable'
})
export class SystemPool2SasiTablePipe implements PipeTransform {

  transform(systems: SystemDetail[], args?: any): any {
    return systems.map(
      system => {
        const row = {};
        row['name'] = new SasiCell(system.name, system.name);
        system.metrics.forEach(
          metric => row[metric.type] = new SasiCell(metric.value, metric)
        );
        return row;
      }
    );
  }

}
