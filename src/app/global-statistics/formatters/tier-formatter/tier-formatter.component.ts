import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/SystemMetric';
import {SasiColumn, SasiRow} from '../../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-tier-formatter',
  templateUrl: './tier-formatter.component.html',
  styleUrls: ['./tier-formatter.component.css']
})
export class TierFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;

  constructor() {
  }

  ngOnInit() {
    console.log(this.rowData.externals);
  }

  isHidden(): boolean {
    return this.rowData.externals.length > 0;
  }

  getTierNameString() {
    return this.rowData.externals.map(external => external.value)
      .sort();
  }

  isExceptionTier(i: number): boolean {
    return i > 0;
  }
}
