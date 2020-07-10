import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {StorageEntityResponseDto} from '../../common/models/dtos/storage-entity-response.dto';
import {SasiColumnBuilder, SasiTableOptions} from '../../common/components/sasi-table/sasi-table.component';
import {AlertFormatterComponent} from '../../global-statistics/formatters/alert-formatter/alert-formatter.component';
import {RowGroupTableComponent} from '../../common/components/sasi-table/row-group-table/row-group-table.component';
import {SeTextFormatterComponent} from '../se-text-formatter/se-text-formatter.component';
import {SerialNumberFormatterComponent} from '../serial-number-formatter/serial-number-formatter.component';

@Component({
  selector: 'app-storage-location',
  templateUrl: './storage-location.component.html',
  styleUrls: ['./storage-location.component.css']
})
export class StorageLocationComponent implements OnInit {
  data: StorageEntityResponseDto[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  displayForm = false;

  constructor(private metricService: MetricService) {
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

    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = SeTextFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    // this.options.aggregateValuesService = new SumValueServiceImpl();
    // this.options.sortService = new GroupSortAggregateValueImpl();
    this.metricService.getSystemsDetail().subscribe(data => {
      this.data = data;
      console.log(data);
    });
  }

  getValue(system, property) {
    if (system.detail !== undefined) {
      return system.detail[property];
    }
    return null;
  }

  openForm() {
    this.displayForm = true;
  }
  closeForm() {
    this.displayForm = false;
  }
}
