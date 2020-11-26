import {Component} from '@angular/core';
import {SasiColumnBuilder} from '../../common/components/sasi-table/sasi-table.component';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';
import {MetricService} from '../../metric.service';
import {FormBusService} from '../form-bus.service';
import {SeTextFormatterComponent} from '../se-text-formatter/se-text-formatter.component';
import {AlertFormatterComponent} from '../../global-statistics/formatters/alert-formatter/alert-formatter.component';
import {RowTableComponent} from '../../common/components/sasi-table/row-table/row-table.component';
import {SimpleSortImpl} from '../../common/components/sasi-table/simple-sort-impl';
import {StorageEntityList} from '../channel-board-list/channel-board-list.component';

@Component({
  selector: 'app-controller-list',
  templateUrl: '../channel-board-list/channel-board-list.component.html',
  styleUrls: ['../channel-board-list/channel-board-list.component.css']
})
export class ControllerListComponent extends StorageEntityList {

  constructor(protected metricService: MetricService,
              protected formBus: FormBusService) {
    super(metricService, formBus, StorageEntityType.CONTROLLER);
  }

  ngOnInit() {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('parentName')
        .withLabel('DKC')
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


    // this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowTableComponent;
    this.options.storageNamePrefix = 'portConnectivity';
    // this.options.grIndexComponentFormatter = SpeedFormatterComponent;
    this.options.isDataGrouped = false;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.sortService = new SimpleSortImpl();
    this.options.sortColumnNames = ['name'];
  }
}
