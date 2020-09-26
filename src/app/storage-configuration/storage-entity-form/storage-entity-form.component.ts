import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';
import {MetricService} from '../../metric.service';
import {StorageEntityRequestDto} from '../../common/models/dtos/storage-entity-request.dto';
import {StorageEntityDetailRequestDto} from '../../common/models/dtos/storage-entity-detail-request.dto';
import {FormBusService} from '../form-bus.service';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {SystemData} from '../storage-location/storage-location.component';
import {ChangeStatusRequestDto} from '../../common/models/dtos/change-status-request.dto';
import {ComponentStatus} from '../../common/models/dtos/enums/component.status';

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
  sortId: number;
  status: ComponentStatus;
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
  displayForm: boolean;
  @Input()
  private systemList: SystemData[];
  @Output()
  dataSaved = new EventEmitter<boolean>();
  submitted = false;
  httpErrorDisplayed = false;
  httpError = null;
  forceAsNew = false;
  confirmWindowDisplay = false;
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
    if (this.data.type !== StorageEntityType.DATACENTER) {
      console.log(this.data);
      this.form = new FormGroup({
        'id': new FormControl(this.data.id),
        'datacenter': new FormControl(this.data.parentId, [Validators.required]),
        'name': new FormControl(this.data.name, [Validators.required]),
        'prefixReferenceId': new FormControl(this.data.prefixReferenceId),
        'serialNumber': new FormControl(this.data.serialNumber),
        'arrayModel': new FormControl(this.data.arrayModel),
        'dkc': new FormControl(this.data.dkc),
        'room': new FormControl(this.data.room, [Validators.maxLength(32)]),
        'rack': new FormControl(this.data.rack, [Validators.maxLength(32)]),
        'managementIp': new FormControl(this.data.managementIp),
        'sortId': new FormControl(this.data.sortId),
        'forceAsNew': new FormControl(this.forceAsNew),
      }, [duplicatedSerialNumber(this.systemList)]);
    } else {
      this.form = new FormGroup({
        'name': new FormControl(this.data.name, [Validators.required]),
        'forceAsNew': new FormControl(this.forceAsNew),
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

  get serial() {
    return this.form.get('serialNumber');
  }

  get room() {
    return this.form.get('room');
  }

  get rack() {
    return this.form.get('rack');
  }

  saveChanges(forceAsNew: boolean = false) {
    const {dto, detailDto} = this.transformDataToDto();

    if (this.data.id !== undefined && !forceAsNew) {
      this.updateDetails(detailDto);
    } else {
      this.form.get('forceAsNew').setValue(true);
      this.submitted = true;
      if (this.form.valid) {
        this.saveAsNew(dto, detailDto);
      }
      setTimeout(
        () => {
          this.form.get('forceAsNew').setValue(false);
          this.submitted = false;
        },
        2000
      );
    }
  }

  private updateDetails(detailDto: StorageEntityDetailRequestDto) {
    this.metricService.updateStorageEntity(this.data.id, detailDto).subscribe(
      () => {
        const datacenterId = this.form.get('datacenter').value;
        if (this.data.id != null && this.data.parentId !== datacenterId) {
          this.metricService.moveStorageEntity(this.data.id, datacenterId).subscribe(
            () => this.success()
          );
        } else {
          this.success();
        }
      },
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
    if (this.data.type !== StorageEntityType.DATACENTER) {
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
      detailDto.sortId = this.form.value.sortId;
    }
    return {dto, detailDto};
  }

  private saveAsNew(dto: StorageEntityRequestDto, detailDto: StorageEntityDetailRequestDto) {
    this.metricService.createStorageEntity(dto).subscribe(
      response => {
        if (response.storageEntity.id != null && StorageEntityType[response.storageEntity.type] !== StorageEntityType.DATACENTER) {
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
          this.httpError = 'System already exists under the same or different datacenter.';
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

  deactivate() {
    this.confirmWindowDisplay = false;
    if (this.data.id !== undefined) {
      console.log(this.data.status);
      const newStatus = this.data.status === ComponentStatus.ACTIVE ? ComponentStatus.INACTIVE : ComponentStatus.ACTIVE;
      console.log(newStatus);
      const dto = new ChangeStatusRequestDto(ComponentStatus[newStatus]);
      this.metricService.updateStatus(this.data.id, dto).subscribe(
        () => this.success()
      );
    }
  }

  confirmDisplayWindow() {
    this.confirmWindowDisplay = true;
  }

  closeConfirmationWindow() {
    this.confirmWindowDisplay = false;
  }
}

export function duplicatedSerialNumber(systemList: SystemData[]): ValidatorFn {
  return (control: FormGroup): ValidationErrors | null => {
    const serialNumber = control.get('serialNumber').value;
    const id = control.get('id').value;
    const prefix = control.get('prefixReferenceId').value;
    const forceAsNew = control.get('forceAsNew').value;
    const foundSystem = systemList.find(system => {
      if (forceAsNew) {
        return system.serial === serialNumber && system.prefix === prefix;
      } else {
        return system.serial === serialNumber && system.prefix === prefix && system.id !== id;
      }
    });
    return foundSystem ? {duplicatedSerialNumber: {value: control.value}} : null;
  };
}
