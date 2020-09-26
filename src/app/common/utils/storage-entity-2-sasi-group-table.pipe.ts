import {Pipe, PipeTransform} from '@angular/core';
import {SasiCell, SasiGroupRow, SasiRow} from '../components/sasi-table/sasi-table.component';
import {StorageEntityResponseDto} from '../models/dtos/storage-entity-response.dto';
import {StorageEntityDetail2SasiTablePipe} from './storage-entity-detail-2-sasi-table.pipe';
import {ComponentStatus} from '../models/dtos/enums/component.status';

@Pipe({
  name: 'storageEntity2SasiGroupTable'
})
export class StorageEntity2SasiGroupTablePipe implements PipeTransform {

  constructor(private rowPipe: StorageEntityDetail2SasiTablePipe) {
  }

  transform(systems: StorageEntityResponseDto[], context?: string): SasiGroupRow[] {
    return systems.map(
      storageEntity => {
        const row = new SasiGroupRow();
        const groupRow = new SasiRow();
        const data = storageEntity.storageEntity;
        groupRow.cells['name'] = new SasiCell(data.name, {
          id: data.name,
          iFrameLink: context,
          value: data.name,
          dbId: data.id,
          status: ComponentStatus[data.status]
        });
        row.groupRow = groupRow;
        row.rows = this.rowPipe.transform(data.children, data);
        return row;
      }
    );
  }
}
