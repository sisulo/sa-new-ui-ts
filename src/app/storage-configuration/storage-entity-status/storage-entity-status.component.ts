import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiRow} from '../../common/components/sasi-table/sasi-table.component';
import {FormBusService} from '../form-bus.service';
import {StorageEntityVo} from '../storage-entity-form/storage-entity-form.component';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';
import {ComponentStatus} from '../../common/models/dtos/enums/component.status';

@Component({
  selector: 'app-storage-entity-status',
  templateUrl: './storage-entity-status.component.html',
  styleUrls: ['./storage-entity-status.component.css']
})
export class StorageEntityStatusComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;

  constructor(private formBus: FormBusService) {
  }

  ngOnInit() {
  }

  openForm() {
    const formData = new StorageEntityVo();
    formData.type = StorageEntityType.SYSTEM;
    formData.status = this.getCellValue('status');
    formData.serialNumber = this.getCellValue('serialNumber');
    formData.parentId = this.getCellValue('parentId');
    formData.prefixReferenceId = this.getCellValue('prefixReferenceId');
    formData.name = this.getCellValue('name');
    formData.id = this.getCellValue('id');
    formData.dkc = this.getCellValue('dkc');
    formData.room = this.getCellValue('room');
    formData.rack = this.getCellValue('rack');
    formData.arrayModel = this.getCellValue('arrayModel');
    formData.managementIp = this.getCellValue('managementIp');
    this.formBus.sendFormData({data: formData, selectedData: []});
  }

  isActive() {
    return this.getCellValue('status') === 1;
  }

  getCellValue(valueName: string) {
    if (this.rowData.cells[valueName] !== undefined) {
      return this.rowData.cells[valueName].value;
    }
    return null;
  }
}
