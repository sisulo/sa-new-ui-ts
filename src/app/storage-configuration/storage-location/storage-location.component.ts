import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {StorageEntityResponseDto} from '../../common/models/dtos/storage-entity-response.dto';
import {SasiColumnBuilder, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {AlertFormatterComponent} from '../../global-statistics/formatters/alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SeTextFormatterComponent} from '../se-text-formatter/se-text-formatter.component';
import {SerialNumberFormatterComponent} from '../serial-number-formatter/serial-number-formatter.component';
import {FormBusService} from '../form-bus.service';
import {StorageEntityVo} from '../storage-entity-form/storage-entity-form.component';
import {GroupSortImpl} from '../../common/components/sasi-table/group-sort-impl';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';

export class SystemData {
  serial: string;
  prefix: string;
  id: number;
  systemName: string;
}

@Component({
  selector: 'app-storage-location',
  templateUrl: './storage-location.component.html',
  styleUrls: ['./storage-location.component.css']
})
export class StorageLocationComponent implements OnInit {
  data: StorageEntityResponseDto[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  datacenterList = [];
  systemList: SystemData[] = [];
  type = StorageEntityType;

  constructor(private metricService: MetricService,
              private formBus: FormBusService) {
  }

  ngOnInit() {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withAltLabel('Datacenter / System')
        .withLabel('System')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('arrayModel')
        .withLabel('Array Model')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('prefixReferenceId')
        .withLabel('Physical Serial Number')
        .withComponent(SerialNumberFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('dkc')
        .withLabel('Virtual DKCs')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('managementIp')
        .withLabel('Management IP')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('room')
        .withLabel('Room')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('rack')
        .withLabel('Rack')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('sortId')
        .withLabel('Sort ID')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );

    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = SeTextFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.sortService = new GroupSortImpl(true);
    this.options.sortColumnNames = ['sortId', 'name'];
    this.loadData();
  }

  getValue(system, property) {
    if (system.detail !== undefined) {
      return system.detail[property];
    }
    return null;
  }

  openForm(type: StorageEntityType) {
    const data = new StorageEntityVo();
    data.type = type;
    this.formBus.sendFormData(data);
  }

  loadData(force: boolean = true) {
    if (force) {
      this.metricService.getSystemsDetail().subscribe(data => {
        this.data = data;
        this.data.forEach(datacenter => {
          datacenter.storageEntity.children.forEach(system => {
            this.systemList.push({
              systemName: system.name,
              id: system.id,
              serial: system.serialNumber,
              prefix: system.detail.prefixReferenceId
            });
          });
        });
        this.datacenterList = this.data.map(datacenter => datacenter.storageEntity);
      });
    }
  }
}
