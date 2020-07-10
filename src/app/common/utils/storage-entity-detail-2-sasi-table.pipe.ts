import {SasiCell, SasiRow} from '../components/sasi-table/sasi-table.component';
import {Pipe, PipeTransform, Injectable} from '@angular/core';
import {Owner} from '../models/dtos/owner.dto';
@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'StorageEntityDetail2SasiTablePipe'
})
export class StorageEntityDetail2SasiTablePipe implements PipeTransform {

  transform(systems: Owner[], context?: string): SasiRow[] {
    return systems.map(
      system => {
        const row = new SasiRow();
        row.cells['name'] = new SasiCell(system.name, {value: system.name});
        if (system.detail !== undefined) {
          const detail = system.detail;
          row.cells['arrayModel'] = new SasiCell(detail.arrayModel, {value: detail.arrayModel});
          row.cells['managementIp'] = new SasiCell(detail.managementIp, {value: detail.managementIp});
          row.cells['dkc'] = new SasiCell(detail.dkc, {value: detail.dkc});
          row.cells['rack'] = new SasiCell(detail.rack, {value: detail.rack});
          row.cells['room'] = new SasiCell(detail.room, {value: detail.room});
          row.cells['prefixReferenceId'] = new SasiCell(detail.prefixReferenceId, {value: detail.prefixReferenceId});
          row.cells['serialNumber'] = new SasiCell(system.serialNumber, {value: detail.serialNumber});
        }
        return row;
      }
    );
  }
}
