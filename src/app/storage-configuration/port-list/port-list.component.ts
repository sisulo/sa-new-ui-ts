import {Component} from '@angular/core';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';
import {SasiColumnBuilder} from '../../common/components/sasi-table/sasi-table.component';
import {MetricService} from '../../metric.service';
import {FormBusService} from '../form-bus.service';
import {SeTextFormatterComponent} from '../se-text-formatter/se-text-formatter.component';
import {RowTableComponent} from '../../common/components/sasi-table/row-table/row-table.component';
import {SimpleSortImpl} from '../../common/components/sasi-table/simple-sort-impl';
import {StorageEntityList} from '../channel-board-list/channel-board-list.component';
import {SpeedFormatterComponent} from '../speed-formatter/speed-formatter.component';

@Component({
  selector: 'app-port-list',
  templateUrl: '../channel-board-list/channel-board-list.component.html',
  styleUrls: ['../channel-board-list/channel-board-list.component.css']
})
export class PortListComponent extends StorageEntityList {

  constructor(protected metricService: MetricService,
              protected formBus: FormBusService) {
    super(metricService, formBus, StorageEntityType.PORT);
  }

  ngOnInit() {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('parentName')
        .withLabel('Channel Board')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('name')
        .withAltLabel('Name')
        .withLabel('Name')
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
        .withComponent(SpeedFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('cables')
        .withAltLabel('Cables')
        .withLabel('Cables')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('switch')
        .withAltLabel('Switch')
        .withLabel('Switch')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('slot')
        .withAltLabel('Slot/Port')
        .withLabel('Slot/Port')
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
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex('wwn')
        .withAltLabel('WWN')
        .withLabel('WWN')
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );

    this.options.rowComponentFormatter = RowTableComponent;
    // this.options.grIndexComponentFormatter = SpeedFormatterComponent;
    this.options.isDataGrouped = false;
    this.options.selectableRows = true;
    this.options.storeSelectedRows = false;
    this.options.storageNamePrefix = 'portList';
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.sortService = new SimpleSortImpl();
    this.options.sortColumnNames = ['name'];
  }
}
