import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KnobSaComponent} from './components/knob/knob-sa.component';
import {IframeUrlCreatorPipe} from './utils/iframe-url-creator.pipe';
import {InfoBoxComponent} from './components/info-box/info-box.component';
import {SystemPool2SasiTablePipe} from './utils/system-pool-2-sasi-table.pipe';
import {SasiTableComponent} from './components/sasi-table/sasi-table.component';
import {CellTableComponent} from './components/sasi-table/cell-table.component';
import {FormatterHostDirective} from './components/sasi-table/formatter-host.directive';
import {TooltipModule} from 'ng2-tooltip-directive';
import {RowTableComponent} from './components/sasi-table/row-table/row-table.component';
import {SmallBoxComponent} from './components/small-box/small-box.component';
import {RouterModule} from '@angular/router';
import {SystemPool2SasiGroupTablePipe} from './utils/system-pool-2-sasi-group-table.pipe';
import {RowGroupTableComponent} from './components/sasi-table/row-group-table/row-group-table.component';
import {RowDynamicComponent} from './components/sasi-table/row-dynamic.component';
import {Ng2KnobDirective} from './components/knob/ng-2-knob.directive';
import {LocaleNumberFormatPipe} from './components/small-box/locale-number-format.pipe';
import {SafeHtmlPipe} from './utils/safe-html.pipe';
import {FormatThousandsPipe} from './utils/format-thousands.pipe';
import {RouteLinkFormatterComponent} from './components/route-link-formatter/route-link-formatter.component';
import {StorageConvertPipe} from './storage-convert.pipe';
import {AlertInfoBoxComponent} from './components/info-box/alert-info-box.component';
import {ColumnComponent} from './components/sasi-table/column/column.component';
import {ParityGroup2SasiGroupTablePipe} from '../global-statistics/views/parity-group-events/parity-group-2-sasi-group-table.pipe';
import {ParityGroup2SasiTablePipe} from '../global-statistics/views/parity-group-events/parity-group-2-sasi-table.pipe';

@NgModule({
  declarations: [
    IframeUrlCreatorPipe,
    InfoBoxComponent,
    SystemPool2SasiTablePipe,
    SasiTableComponent,
    CellTableComponent,
    FormatterHostDirective,
    RowTableComponent,
    RowDynamicComponent,
    SmallBoxComponent,
    SystemPool2SasiGroupTablePipe,
    RowGroupTableComponent,
    KnobSaComponent,
    Ng2KnobDirective,
    LocaleNumberFormatPipe,
    SafeHtmlPipe,
    FormatThousandsPipe,
    RouteLinkFormatterComponent,
    StorageConvertPipe,
    AlertInfoBoxComponent,
    ColumnComponent

  ],
  imports: [
    CommonModule,
    TooltipModule,
    RouterModule,
  ],
  exports: [
    IframeUrlCreatorPipe,
    InfoBoxComponent,
    SystemPool2SasiTablePipe,
    SystemPool2SasiGroupTablePipe,
    SasiTableComponent,
    KnobSaComponent,
    SmallBoxComponent,
    Ng2KnobDirective,
    SafeHtmlPipe,
    FormatThousandsPipe,
    RouteLinkFormatterComponent,
    StorageConvertPipe,
    AlertInfoBoxComponent,
  ],
  entryComponents: [
    RowTableComponent,
    RowGroupTableComponent,
  ]
})
export class SaCommonModule {
}
