import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiRow} from '../../../common/components/sasi-table/sasi-table.component';

@Component({
  selector: 'app-tier-formatter',
  templateUrl: './tier-formatter.component.html',
  styleUrls: ['./tier-formatter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TierFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;
  colorMapping = [];

  constructor() {
  }

  ngOnInit() {
    this.colorMapping['T0'] = 'bg-primary';
    this.colorMapping['T1'] = 'bg-success';
    this.colorMapping['T2'] = 'bg-warning';
    this.colorMapping['T3'] = 'bg-danger';
    this.colorMapping['T4'] = 'bg-teal';
    this.colorMapping['T5'] = 'bg-purple';
    this.colorMapping['T6'] = 'bg-maroon';

  }

  isHidden(): boolean {
    return this.rowData.externals.length > 0;
  }

  getTierNameString() {
    return this.rowData.externals.map(external => external.value)
      .sort();
  }

  getTierColor(name: string): string {
    return 'badge ' + this.colorMapping[name];
  }
}
