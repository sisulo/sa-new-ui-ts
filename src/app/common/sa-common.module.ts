import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KnobSaComponent} from './components/knob/knob-sa.component';
import {IframeUrlCreatorPipe} from './utils/iframe-url-creator.pipe';
import {InfoBoxComponent} from './components/info-box/info-box.component';
import {SystemPool2SasiTablePipe} from './utils/system-pool-2-sasi-table.pipe';
import {SasiTableComponent} from './components/sasi-table/sasi-table.component';
import {CellTableComponent} from './components/sasi-table/cell-table.component';
import {FormatterHostDirective} from './components/sasi-table/formatter-host.directive';
import {UnitFormatterComponent} from '../global-statistics/formatters/unit-formatter/unit-formatter.component';
import {TooltipModule} from 'ng2-tooltip-directive';
import {RowTableComponent} from './components/sasi-table/row-table/row-table.component';
import {AlertFormatterComponent} from '../global-statistics/formatters/alert-formatter/alert-formatter.component';
import {SmallBoxComponent} from './components/small-box/small-box.component';
import {RouterModule} from '@angular/router';
import {SystemPool2SasiGroupTablePipe} from './utils/system-pool-2-sasi-group-table.pipe';
import {RowGroupTableComponent} from './components/sasi-table/row-group-table/row-group-table.component';
import {RowDynamicComponent} from './components/sasi-table/row-dynamic.component';
import {SimpleFormatterComponent} from '../global-statistics/formatters/simple-formatter/simple-formatter.component';
import {Ng2KnobDirective} from './components/knob/ng-2-knob.directive';
import {LocaleNumberFormatPipe} from './components/small-box/locale-number-format.pipe';
import {TimeFormatterComponent} from '../global-statistics/formatters/time-formatter/time-formatter.component';
import {TextFormatterComponent} from '../global-statistics/formatters/text-formatter/text-formatter.component';
import {EmphFormatterComponent} from '../global-statistics/formatters/emph-formatter/emph-formatter.component';
import {SafeHtmlPipe} from './utils/safe-html.pipe';
import {DisbalanceFormatterComponent} from '../global-statistics/formatters/disbalance-formatter/disbalance-formatter.component';
import {FormatThousandsPipe} from './utils/format-thousands.pipe';
import {RouteLinkFormatterComponent} from './components/route-link-formatter/route-link-formatter.component';

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
    RouteLinkFormatterComponent

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
  ],
  entryComponents: [
    UnitFormatterComponent,
    AlertFormatterComponent,
    SimpleFormatterComponent,
    RowTableComponent,
    RowGroupTableComponent,
    TimeFormatterComponent,
    TextFormatterComponent,
    EmphFormatterComponent,
    DisbalanceFormatterComponent,
    RouteLinkFormatterComponent
  ]
})
export class SaCommonModule {
}
