import {Component, Input, OnInit} from '@angular/core';
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

export abstract class StorageEntityList implements OnInit {
  @Input()
  data: Owner[] = [];
  @Input()
  displayAddButton = false;
  @Input()
  parentsData: Owner[] = [];
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

  getValue(system, property) {
    if (system.detail !== undefined) {
      return system.detail[property];
    }
    return null;
  }

  public openForm(type: StorageEntityType) {
    const data = new StorageEntityVo();
    data.type = type;
    this.formBus.sendFormData(data);
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
        .withIndex('parentName')
        .withLabel('Controller')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withLabel('Name')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('speed')
        .withLabel('Speed')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('note')
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
  }

}

