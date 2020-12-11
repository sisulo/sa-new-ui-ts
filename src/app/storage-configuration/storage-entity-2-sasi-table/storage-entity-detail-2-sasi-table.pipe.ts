import {SasiCell, SasiRow} from '../../common/components/sasi-table/sasi-table.component';
import {Pipe, PipeTransform, Injectable} from '@angular/core';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {ComponentStatus} from '../../common/models/dtos/enums/component.status';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'StorageEntityDetail2SasiTablePipe'
})
export class StorageEntityDetail2SasiTablePipe implements PipeTransform {


  transform(systems: Owner[], parent: Owner, parentsData: Owner[] = []): SasiRow[] {
    return systems.map(
      system => {
        const row = new SasiRow();
        row.cells['name'] = new SasiCell(system.name, {value: system.name});
        row.cells['id'] = new SasiCell(system.id, {value: system.id});
        const type = StorageEntityType[system.type];
        row.cells['type'] = new SasiCell(type, {value: type});
        const parentId = parent !== null ? parent.id : system.parentId;
        const parentName = parent != null ? parent.name : system.parent.name;
        row.cells['parentId'] = new SasiCell(parentId, {value: parentId});
        row.cells['parentName'] = new SasiCell(parentName, {value: parentName});
        row.cells['status'] = new SasiCell(ComponentStatus[system.status], {value: ComponentStatus[system.status]});
        row.cells['serialNumber'] = new SasiCell(system.serialNumber, {value: system.serialNumber});
        if (system.detail !== undefined) {
          const detail = system.detail;
          row.cells['arrayModel'] = new SasiCell(detail.arrayModel, {value: detail.arrayModel});
          row.cells['managementIp'] = new SasiCell(detail.managementIp, {value: detail.managementIp});
          row.cells['dkc'] = new SasiCell(detail.dkc, {value: detail.dkc});
          row.cells['rack'] = new SasiCell(detail.rack, {value: detail.rack});
          row.cells['room'] = new SasiCell(detail.room, {value: detail.room});
          row.cells['prefixReferenceId'] = new SasiCell(detail.prefixReferenceId, {value: detail.prefixReferenceId});
          row.cells['sortId'] = new SasiCell(detail.sortId, {value: detail.sortId});
          row.cells['speed'] = new SasiCell(detail.speed, {value: detail.speed});
          row.cells['note'] = new SasiCell(detail.note, {value: detail.note});
          row.cells['cables'] = new SasiCell(detail.cables, {value: detail.cables});
          row.cells['switch'] = new SasiCell(detail.switch, {value: detail.switch});
          row.cells['slot'] = new SasiCell(detail.slot, {value: detail.slot});
          row.cells['wwn'] = new SasiCell(detail.wwn, {value: detail.wwn});
        }
        return row;
      }
    );
  }

  getParentName(parentId: number, parentsData: Owner[]) {
    const foundParent = parentsData.find(parent => parent.id === parentId);
    if (foundParent) {
      return foundParent.name;
    }
    return null;
  }

}
