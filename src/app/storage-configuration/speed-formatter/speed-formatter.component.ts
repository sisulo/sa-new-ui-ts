import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiRow} from '../../common/components/sasi-table/sasi-table.component';
import {FormBusService} from '../form-bus.service';
import {StorageEntityVo} from '../storage-entity-form/storage-entity-form.component';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';

@Component({
  selector: 'app-speed-formatter',
  templateUrl: './speed-formatter.component.html',
  styleUrls: ['./speed-formatter.component.css']
})
export class SpeedFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;
  constructor(private formBus: FormBusService) { }

  ngOnInit() {
  }

  getValue() {
    if (this.column === undefined) {
      return this.data['value'];
    }
    return this.data.value;
  }

  openForm() {
    const formData = new StorageEntityVo();
    if (this.column === undefined) {
      formData.id = this.data['dbId'];
      formData.name = this.data['value'].toString();
      formData.status = this.data['status'];
      formData.type = StorageEntityType.DATACENTER;
    } else {
      formData.type = this.getCellValue('type');
      formData.serialNumber = this.getCellValue('serialNumber');
      formData.status = this.getCellValue('status');
      formData.parentId = this.getCellValue('parentId');
      formData.prefixReferenceId = this.getCellValue('prefixReferenceId');
      formData.name = this.getCellValue('name');
      formData.id = this.getCellValue('id');
      formData.dkc = this.getCellValue('dkc');
      formData.room = this.getCellValue('room');
      formData.rack = this.getCellValue('rack');
      formData.arrayModel = this.getCellValue('arrayModel');
      formData.managementIp = this.getCellValue('managementIp');
      formData.sortId = this.getCellValue('sortId');
      formData.speed = this.getCellValue('speed');
      formData.note = this.getCellValue('note');
      formData.note = this.getCellValue('note');
      formData.cables = this.getCellValue('cables');
      formData.switch = this.getCellValue('switch');
      formData.slot = this.getCellValue('slot');
      formData.wwn = this.getCellValue('wwn');

    }
    this.formBus.sendFormData(formData);
  }

  getCellValue(valueName: string) {
    if (this.rowData.cells[valueName] !== undefined) {
      return this.rowData.cells[valueName].value;
    }
    return null;
  }
}
