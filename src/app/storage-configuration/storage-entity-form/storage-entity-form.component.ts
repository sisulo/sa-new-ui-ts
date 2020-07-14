import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';
import {MetricService} from '../../metric.service';
import {StorageEntityRequestDto} from '../../common/models/dtos/storage-entity-request.dto';
import {StorageEntityDetailRequestDto} from '../../common/models/dtos/storage-entity-detail-request.dto';

export class StorageEntityVo {
  name: string;
  parentId: { value, label };
  type: StorageEntityType;
  serialNumber: string;
  arrayModel: string;
  dkc: string;
  managementIp: string;
  rack: string;
  prefixReferenceId: string;
  room: string;
}

@Component({
  selector: 'app-storage-entity-form',
  templateUrl: './storage-entity-form.component.html',
  styleUrls: ['./storage-entity-form.component.css']
})
export class StorageEntityFormComponent implements OnInit {
  @Input()
  dataCenterList: { value, label }[];
  @Input()
  private displayForm: boolean;
  @Output()
  displayed = new EventEmitter<boolean>();

  data = new StorageEntityVo();

  constructor(private metricService: MetricService) {
  }

  ngOnInit() {
    this.data.type = StorageEntityType.SYSTEM;
    // subscribe or new StorageEntityVo
  }

  closeForm() {
    this.displayForm = false;
    this.displayed.emit(this.displayForm);
  }

  saveChanges() {
    const dto = new StorageEntityRequestDto();
    dto.name = this.data.name;
    dto.parentId = this.data.parentId.value;
    dto.type = StorageEntityType[this.data.type];
    dto.serialNumber = this.data.serialNumber;
    const detailDto = new StorageEntityDetailRequestDto();
    detailDto.arrayModel = this.data.arrayModel;
    detailDto.dkc = this.data.dkc;
    detailDto.managementIp = this.data.managementIp;
    detailDto.prefixReferenceId = this.data.prefixReferenceId;
    detailDto.rack = this.data.rack;
    detailDto.room = this.data.room;
    detailDto.name = this.data.name;
    detailDto.serialNumber = this.data.serialNumber;
    this.metricService.createStorageEntity(dto).subscribe(
      response => {
        if (response.storageEntity.id != null) {
          this.metricService.updateStorageEntity(response.storageEntity.id, detailDto).subscribe(
            responseDetail => {
              this.closeForm();
            }
          );
        }
      },
      error => {
        console.error('Cannot store the entity: ' + error);
      }
    );
  }
}
