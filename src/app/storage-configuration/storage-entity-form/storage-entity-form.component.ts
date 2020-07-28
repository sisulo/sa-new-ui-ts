import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';
import {MetricService} from '../../metric.service';
import {StorageEntityRequestDto} from '../../common/models/dtos/storage-entity-request.dto';
import {StorageEntityDetailRequestDto} from '../../common/models/dtos/storage-entity-detail-request.dto';
import {FormBusService} from '../form-bus.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export class StorageEntityVo {
  id: number;
  name: string;
  parentId: number;
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
  dataSaved = new EventEmitter<boolean>();
  submitted = false;
  httpErrorDisplayed = false;
  httpError = null;

  data = new StorageEntityVo();
  form: FormGroup;
  staticType = StorageEntityType;

  constructor(private metricService: MetricService,
              private formBusService: FormBusService) {
  }

  ngOnInit() {
    this.formBusService.storageEntityFormStream.subscribe(data => {
      this.data = data;
      this.displayForm = true;
      this.initFormControls();
    });
    this.initFormControls();
  }

  initFormControls() {
    if (this.data.type !== StorageEntityType.DATA_CENTER) {

      this.form = new FormGroup({
        'datacenter': new FormControl(this.data.parentId, [Validators.required]),
        'name': new FormControl(this.data.name, [Validators.required]),
        'prefixReferenceId': new FormControl(this.data.prefixReferenceId),
        'serialNumber': new FormControl(this.data.serialNumber),
        'arrayModel': new FormControl(this.data.arrayModel),
        'dkc': new FormControl(this.data.dkc),
        'room': new FormControl(this.data.room),
        'rack': new FormControl(this.data.rack),
        'managementIp': new FormControl(this.data.managementIp),
      });
    } else {
      this.form = new FormGroup({
        'name': new FormControl(this.data.name, [Validators.required]),
      });
    }
  }

  closeForm() {
    this.displayForm = false;
  }

  get name() {
    return this.form.get('name');
  }

  get dataCenter() {
    return this.form.get('datacenter');
  }

  saveChanges(forceAsNew: boolean = false) {
    const {dto, detailDto} = this.transformDataToDto();

    if (this.data.id !== undefined && !forceAsNew) {
      this.updateDetails(detailDto);
    } else {
      this.saveAsNew(dto, detailDto);
    }
  }

  private updateDetails(detailDto: StorageEntityDetailRequestDto) {
    this.metricService.updateStorageEntity(this.data.id, detailDto).subscribe(
      () => this.success(),
      error => {
        console.log(error);
      }
    );
  }

  private transformDataToDto() {
    const dto = new StorageEntityRequestDto();
    dto.name = this.form.value.name;
    dto.type = StorageEntityType[this.data.type];
    let detailDto = new StorageEntityDetailRequestDto();
    detailDto.name = this.form.value.name;
    if (this.data.type !== StorageEntityType.DATA_CENTER) {
      dto.parentId = this.form.value.datacenter;
      dto.serialNumber = this.form.value.serialNumber;

      detailDto = new StorageEntityDetailRequestDto();
      detailDto.arrayModel = this.form.value.arrayModel;
      detailDto.dkc = this.form.value.dkc;
      detailDto.managementIp = this.form.value.managementIp;
      detailDto.prefixReferenceId = this.form.value.prefixReferenceId;
      detailDto.rack = this.form.value.rack;
      detailDto.room = this.form.value.room;
      detailDto.name = this.form.value.name;
      detailDto.serialNumber = this.form.value.serialNumber;
    }
    return {dto, detailDto};
  }

  private saveAsNew(dto: StorageEntityRequestDto, detailDto: StorageEntityDetailRequestDto) {
    this.metricService.createStorageEntity(dto).subscribe(
      response => {
        if (response.storageEntity.id != null && StorageEntityType[response.storageEntity.type] !== StorageEntityType.DATA_CENTER) {
          this.metricService.updateStorageEntity(response.storageEntity.id, detailDto).subscribe(
            () => this.success()
          );
        } else {
          this.success();
        }
      },
      // TODO error code as ENUM
      response => {
        if (response.error.code === 1002) {
          this.httpErrorDisplayed = true;
          this.httpError = 'System already exists under the datacenter.';
          setTimeout(
            () => this.httpErrorDisplayed = false,
            10000
          );
        }
        console.error(response.error);
        console.error('Cannot store the entity: ');
      }
    );
  }

  private success() {
    this.closeForm();
    this.dataSaved.emit(true);
  }
}
