import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {MetricService} from '../../metric.service';
import {StorageEntityRequestDto} from '../../common/models/dtos/storage-entity-request.dto';
import {StorageEntityDetailRequestDto} from '../../common/models/dtos/storage-entity-detail-request.dto';
import {FormBusService} from '../form-bus.service';
import {FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {SystemData} from '../storage-location/storage-location.component';
import {ChangeStatusRequestDto} from '../../common/models/dtos/change-status-request.dto';
import {ComponentStatus} from '../../common/models/dtos/enums/component.status';
import {DuplicateStorageEntityDto} from '../../common/models/dtos/duplicate-storage-entity.dto';
import {Router} from '@angular/router';

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
  speed: number;
  note: string;
  cables: string;
  switch: string;
  slot: string;
  wwn: string;
  duplicateOperation = false;
}

interface FormStaticData {
  storageEntityLabel;
  parentNameLabel;
  parents;
}

@Component({
  selector: 'app-storage-entity-form',
  templateUrl: './storage-entity-form.component.html',
  styleUrls: ['./storage-entity-form.component.css']
})
export class StorageEntityFormComponent implements OnInit, OnChanges {
  @Input()
  dataCenterList: Owner[];
  @Input()
  dkcList: Owner[];
  @Input()
  controllerList: Owner[];
  @Input()
  channelBoardList: Owner[];
  @Input()
  parentSystemList: Owner[];
  @Input()
  portList: Owner[];
  @Input()
  private systemList: Owner[];
  @Input()
  private selectedParent: number;
  @Input()
  displayForm: boolean;
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
  staticData: FormStaticData[] = [];
  selectedRows: Owner[] = [];

  constructor(private metricService: MetricService,
              private formBusService: FormBusService,
              private router: Router) {
  }

  ngOnInit() {
    this.formBusService.storageEntityFormStream$.subscribe(stream => {
      this.data = stream.data;
      this.selectedRows = stream.selectedData;
      if (this.data.type === StorageEntityType.DKC) {
        this.data.parentId = this.selectedParent;
      }
      this.initFormControls();
      this.form.markAsUntouched();
      this.submitted = false;
      this.httpErrorDisplayed = false;
      this.displayForm = true;
    });
    this.initFormControls();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initStaticData();
  }

  initStaticData() {
    this.staticData[StorageEntityType.DKC] = {
      storageEntityLabel: 'DKC',
      parentNameLabel: 'System',
      parents: this.parentSystemList
    };
    this.staticData[StorageEntityType.CONTROLLER] = {
      storageEntityLabel: 'Controller',
      parentNameLabel: 'DKC',
      parents: this.dkcList
    };
    this.staticData[StorageEntityType.CHANNEL_BOARD] = {
      storageEntityLabel: 'Channel Board',
      parentNameLabel: 'Controller',
      parents: this.controllerList
    };
    this.staticData[StorageEntityType.PORT] = {
      storageEntityLabel: 'Port',
      parentNameLabel: 'Channel Board',
      parents: this.channelBoardList
    };
    this.staticData[StorageEntityType.SYSTEM] = {
      storageEntityLabel: 'System',
      parentNameLabel: 'Datacenter',
      parents: this.dataCenterList
    };
    this.staticData[StorageEntityType.DATACENTER] = {
      storageEntityLabel: 'Datacenter',
      parentNameLabel: '',
      parents: []
    };
  }

  initFormControls() {
    if (this.data.type === StorageEntityType.SYSTEM) {
      if (this.data.duplicateOperation) {
        this.form = new FormGroup({
          'id': new FormControl(this.data.id),
          'parent': new FormControl(this.data.parentId, [Validators.required]),
          'name': new FormControl(this.data.name, [Validators.required]),
          'prefixReferenceId': new FormControl(this.data.prefixReferenceId),
          'serialNumber': new FormControl(this.data.serialNumber),
          'forceAsNew': new FormControl(true),
        }, [duplicatedSerialNumber(this.systemList)]);
      } else {
        this.form = new FormGroup({
          'id': new FormControl(this.data.id),
          'parent': new FormControl(this.data.parentId, [Validators.required]),
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
      }
    } else if (this.data.type === StorageEntityType.DATACENTER) {
      this.form = new FormGroup({
        'name': new FormControl(this.data.name, [Validators.required]),
        'forceAsNew': new FormControl(this.forceAsNew),
      });
    } else if (this.data.type === StorageEntityType.DKC
      || this.data.type === StorageEntityType.CONTROLLER) {
      this.form = new FormGroup({
        'name': new FormControl(this.data.name, [Validators.required]),
        'parent': new FormControl(this.data.parentId, [Validators.required]),
        'forceAsNew': new FormControl(this.forceAsNew),
      });
    } else if (this.data.type === StorageEntityType.CHANNEL_BOARD) {
      if (this.selectedRows.length > 0) {
        this.form = new FormGroup({
          'speed': new FormControl(this.data.speed, [Validators.pattern('[0-9]+')]),
          'note': new FormControl(this.data.note, [Validators.maxLength(255)]),
          'forceAsNew': new FormControl(this.forceAsNew),
        });
      } else {

        this.form = new FormGroup({
          'name': new FormControl(this.data.name, [Validators.required]),
          'parent': new FormControl(this.data.parentId, [Validators.required]),
          'speed': new FormControl(this.data.speed, [Validators.pattern('[0-9]+')]),
          'note': new FormControl(this.data.note, [Validators.maxLength(255)]),
          'forceAsNew': new FormControl(this.forceAsNew),
        });
      }
    } else if (this.data.type === StorageEntityType.PORT) {
      if (this.selectedRows.length > 0) {
        this.form = new FormGroup({
          'speed': new FormControl(this.data.speed, [Validators.pattern('[0-9]+')]),
          'note': new FormControl(this.data.note, [Validators.maxLength(255)]),
          'cables': new FormControl(this.data.cables, [Validators.maxLength(50)]),
          'wwn': new FormControl(this.data.wwn, [Validators.maxLength(100)]),
          'slot': new FormControl(this.data.slot, [Validators.maxLength(30)]),
          'switch': new FormControl(this.data.switch, [Validators.maxLength(30)]),
          'forceAsNew': new FormControl(this.forceAsNew),
        });
      } else {
        this.form = new FormGroup({
          'id': new FormControl(this.data.id),
          'name': new FormControl(this.data.name, [Validators.required]),
          'parent': new FormControl(this.data.parentId, [Validators.required]),
          'speed': new FormControl(this.data.speed, [Validators.pattern('[0-9]+')]),
          'note': new FormControl(this.data.note, [Validators.maxLength(255)]),
          'cables': new FormControl(this.data.cables, [Validators.maxLength(50)]),
          'wwn': new FormControl(this.data.wwn, [Validators.maxLength(100)]),
          'slot': new FormControl(this.data.slot, [Validators.maxLength(30)]),
          'switch': new FormControl(this.data.switch, [Validators.maxLength(30)]),
          'forceAsNew': new FormControl(this.forceAsNew),
        }, [duplicatedPort(this.portList)]);
      }
    }
  }

  closeForm() {
    this.displayForm = false;
  }

  get name() {
    return this.form.get('name');
  }

  get parent() {
    return this.form.get('parent');
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

  get arrayModel() {
    return this.form.get('arrayModel');
  }

  get dkc() {
    return this.form.get('dkc');
  }

  get managementIp() {
    return this.form.get('managementIp');
  }

  get sortId() {
    return this.form.get('sortId');
  }

  get speed() {
    return this.form.get('speed');
  }

  get note() {
    return this.form.get('note');
  }

  get cables() {
    return this.form.get('cables');
  }

  get wwn() {
    return this.form.get('wwn');
  }

  get slot() {
    return this.form.get('slot');
  }

  get switch() {
    return this.form.get('switch');
  }

  saveChanges(forceAsNew: boolean = false) {
    const {dto, detailDto} = this.transformDataToDto();

    if (this.selectedRows.length > 0) {
      this.selectedRows.forEach(owner => {
        this.data.id = owner.id;
        this.updateDetails(detailDto);
      });
    } else if (this.data.id !== undefined && !forceAsNew) {
      this.updateDetails(detailDto);
    } else {
      this.form.get('forceAsNew').setValue(true);
      this.submitted = true;
      if (this.form.valid) {
        this.saveAsNew(dto, detailDto);
      }
    }
  }

  private updateDetails(detailDto: StorageEntityDetailRequestDto) {
    this.metricService.updateStorageEntity(this.data.id, detailDto).subscribe(
      () => {
        if (this.form.get('parent') !== null) {

          const datacenterId = this.form.get('parent').value;
          if (this.data.id != null && this.data.parentId !== datacenterId) {
            this.metricService.moveStorageEntity(this.data.id, datacenterId).subscribe(
              () => this.success()
            );
          } else {
            this.success();
          }
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
    console.log(this.form.value);
    dto.name = this.form.value.name;
    dto.type = StorageEntityType[this.data.type];
    let detailDto = new StorageEntityDetailRequestDto();
    detailDto.name = this.form.value.name;
    if (this.data.type !== StorageEntityType.DATACENTER) {
      dto.parentId = this.form.value.parent;
      dto.serialNumber = this.form.value.serialNumber;

      detailDto = new StorageEntityDetailRequestDto();
      detailDto.arrayModel = this.valueOrUndefined(this.form.value.arrayModel);
      detailDto.dkc = this.valueOrUndefined(this.form.value.dkc);
      detailDto.managementIp = this.valueOrUndefined(this.form.value.managementIp);
      detailDto.prefixReferenceId = this.valueOrUndefined(this.form.value.prefixReferenceId);
      detailDto.rack = this.valueOrUndefined(this.form.value.rack);
      detailDto.room = this.valueOrUndefined(this.form.value.room);
      detailDto.name = this.valueOrUndefined(this.form.value.name);
      detailDto.serialNumber = this.valueOrUndefined(this.form.value.serialNumber);
      detailDto.sortId = this.valueOrUndefined(this.form.value.sortId);
      detailDto.note = this.valueOrUndefined(this.form.value.note);
      detailDto.speed = this.valueOrUndefined(this.form.value.speed);
      detailDto.cables = this.valueOrUndefined(this.form.value.cables);
      detailDto.switch = this.valueOrUndefined(this.form.value.switch);
      detailDto.slot = this.valueOrUndefined(this.form.value.slot);
      detailDto.wwn = this.valueOrUndefined(this.form.value.wwn);
    }
    return {dto, detailDto};
  }

  private valueOrUndefined(value) {
    return (this.selectedRows.length > 0 && value === null) ? undefined : value;
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
          this.httpError = this.getStaticData(StorageEntityType[dto.type]).storageEntityLabel + ' already exists under the same or different ' + this.getStaticData(StorageEntityType[dto.type]).parentNameLabel;
        }
        console.error(response.error);
        console.error('Cannot store the entity: ');
      }
    );
  }

  private success(idSystem: number = null) {
    this.closeForm();
    if (idSystem !== null) {
      this.router.navigate(['/storage-config/port-connectivity'], {queryParams: {id: idSystem}});
    }
    this.dataSaved.emit(true);
  }

  deactivate() {
    this.confirmWindowDisplay = false;
    if (this.data.id !== undefined) {
      const newStatus = this.data.status === ComponentStatus.ACTIVE ? ComponentStatus.INACTIVE : ComponentStatus.ACTIVE;
      const dto = new ChangeStatusRequestDto(ComponentStatus[newStatus]);
      this.metricService.updateStatus(this.data.id, dto).subscribe(
        () => this.success()
      );
    }
    if (this.selectedRows.length > 0) {
      const dto = new ChangeStatusRequestDto(ComponentStatus[ComponentStatus.INACTIVE]);
      this.selectedRows.forEach(owner => {
          this.metricService.updateStatus(owner.id, dto).subscribe(
            () => this.success()
          );
        }
      );
    }
  }

  confirmDisplayWindow() {
    this.confirmWindowDisplay = true;
  }

  closeConfirmationWindow() {
    this.confirmWindowDisplay = false;
  }

  getStaticData(type: StorageEntityType) {
    return this.staticData[type];
  }

  duplicate() {
    const request = new DuplicateStorageEntityDto();
    request.types = [
      StorageEntityType[StorageEntityType.DKC],
      StorageEntityType[StorageEntityType.CONTROLLER],
      StorageEntityType[StorageEntityType.CHANNEL_BOARD],
      StorageEntityType[StorageEntityType.PORT]
    ];
    request.name = this.form.value.name;
    request.serialNumber = this.form.value.serialNumber;
    request.prefixReferenceId = this.form.value.prefixReferenceId;
    this.metricService.duplicateStorageEntity(request, this.data.id).subscribe(
      (response) => this.success(response.storageEntity.id)
    );
  }
}

export function duplicatedSerialNumber(systemList: Owner[]): ValidatorFn {
  return (control: FormGroup): ValidationErrors | null => {
    const serialNumber = control.get('serialNumber').value;
    const id = control.get('id').value;
    const prefix = control.get('prefixReferenceId').value;
    const forceAsNew = control.get('forceAsNew').value;
    console.log(systemList);
    const foundSystem = systemList.find(system => {
      if (forceAsNew) {
        return system.detail !== undefined && system.serialNumber === serialNumber && system.detail.prefixReferenceId === prefix;
      } else {
        return system.detail !== undefined && system.serialNumber === serialNumber && system.detail.prefixReferenceId === prefix && system.id !== id;
      }
    });
    console.log(foundSystem);
    return foundSystem ? {duplicatedSerialNumber: {value: control.value}} : null;
  };
}

export function duplicatedPort(portList: Owner[]): ValidatorFn {
  return (control: FormGroup): ValidationErrors | null => {
    const portName = control.value;
    const id = control.get('id').value;
    const forceAsNew = control.get('forceAsNew').value;
    const foundSystem = portList.find(port => {
      if (forceAsNew) {
        return port.name === portName;
      } else {
        return port.name === portName && port.id !== id;
      }
    });
    return foundSystem ? {duplicatedPortName: {value: control.value}} : null;
  };
}
