import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SasiColumn, SasiGroupRow} from '../../common/components/sasi-table/sasi-table.component';
import {SelectedRow} from '../../common/components/sasi-table/row-table/row-table.component';
import {LocalStorageService} from 'ngx-store';
import {SasiWeightedArithmeticMean} from '../utils/SasiWeightedArithmeticMean';
import {AggregatedValues} from '../../common/components/sasi-table/row-group-table/row-group-table.component';

@Component({
  selector: 'app-aggragated-statistics',
  templateUrl: './aggragated-statistics.component.html',
  styleUrls: ['./aggragated-statistics.component.css']
})
export class AggragatedStatisticsComponent implements OnInit, OnChanges {

  @Input() data: SasiGroupRow[];
  @Input() aggregatedTypes: SasiColumn[];
  @Input() prefix: string;
  selectedRows: Array<SelectedRow>;
  result: AggregatedValues;

  constructor(private localStorageService: LocalStorageService) {

  }

  ngOnInit() {
    this.aggregate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.aggregate();
  }

  aggregate() {
    this.selectedRows = this.localStorageService.get(this.prefix + '_selected');
    if (this.selectedRows === null) {
      this.selectedRows = [];
    }
    const mean = new SasiWeightedArithmeticMean();
    this.result = mean.computeSummaries(this.data, this.selectedRows, null);
  }

  getSelectedCount() {
    const filteredByData = this.selectedRows.filter(
      key => {
        const row = this.data.find(groupRow => groupRow.groupRow.getCell('name').value === key.groupName);
        if (row === undefined) {
          return false;
        }

        return row.rows.find(
          dataRow => dataRow.getCell('name').value === key.rowName
        );
      }
    );
    return filteredByData.length;
  }
}
