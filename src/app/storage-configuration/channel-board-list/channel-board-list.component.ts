import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {SasiColumnBuilder, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {SystemData} from '../storage-location/storage-location.component';
import {MetricService} from '../../metric.service';
import {FormBusService} from '../form-bus.service';
import {SeTextFormatterComponent} from '../se-text-formatter/se-text-formatter.component';
import {AlertFormatterComponent} from '../../global-statistics/formatters/alert-formatter/alert-formatter.component';
import {RowTableComponent} from '../../common/components/sasi-table/row-table/row-table.component';
import {SimpleSortImpl} from '../../common/components/sasi-table/simple-sort-impl';
import {StorageEntityVo} from '../storage-entity-form/storage-entity-form.component';
import {ExtractStorageEntityUtils} from '../utils/extract-storage-entity.utils';

export abstract class StorageEntityList implements OnInit, OnChanges {
  @Input()
  selectedSystem: number;

  data: Owner[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  datacenterList = [];
  systemList: SystemData[] = [];
  type: StorageEntityType;

  protected metricService: MetricService;
  protected formBus: FormBusService;

  protected constructor(metricService: MetricService,
                        formBus: FormBusService,
                        type: StorageEntityType) {
    this.metricService = metricService;
    this.formBus = formBus;
    this.type = type;
  }

  abstract ngOnInit();

  ngOnChanges(changes: SimpleChanges) {
    this.selectedSystem = changes.selectedSystem.currentValue;
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
    if (force && this.selectedSystem !== undefined) {
      this.metricService.getSystemsDetail(this.type, this.selectedSystem).subscribe(data => {
        if (data.length > 0) {
          console.log(data);
          this.data = ExtractStorageEntityUtils.extractByType(data, this.type);
        }
        console.log(this.data);
      });
    }
  }
}

@Component({
  selector: 'app-channel-board-list',
  templateUrl: './channel-board-list.component.html',
  styleUrls: ['./channel-board-list.component.css']
})
export class ChannelBoardListComponent extends StorageEntityList {


  constructor(protected metricService: MetricService,
              protected formBus: FormBusService) {
    super(metricService, formBus, StorageEntityType.CHANNEL_BOARD);
  }


  ngOnInit() {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('id')
        .withAltLabel('ID')
        .withLabel('System')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withAltLabel('Name')
        .withLabel('DKC')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('speed')
        .withAltLabel('Speed')
        .withLabel('Speed')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('note')
        .withAltLabel('Description')
        .withLabel('Description')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowTableComponent;
    // this.options.grIndexComponentFormatter = SeTextFormatterComponent;
    this.options.isDataGrouped = false;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.sortService = new SimpleSortImpl();
    this.options.sortColumnNames = ['name'];
    this.loadData();
  }

}

