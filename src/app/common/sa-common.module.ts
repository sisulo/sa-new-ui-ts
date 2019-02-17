import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KnobSaComponent} from './components/knob/knob-sa.component';
import {KnobModule} from '@xmlking/ngx-knob';
import {IframeUrlCreatorPipe} from './utils/iframe-url-creator.pipe';
import {InfoBoxComponent} from './components/info-box/info-box.component';
import {SystemPool2SasiTablePipe} from './utils/system-pool-2-sasi-table.pipe';
import {SasiTableComponent} from './components/sasi-table/sasi-table.component';
import {CellTableComponent} from './components/sasi-table/cell-table.component';
import {FormatterHostDirective} from './components/sasi-table/formatter-host.directive';
import {SimpleUnitFormatterComponent} from '../global-statistics/simple-unit-formatter/simple-unit-formatter.component';
import {UnitFormatterComponent} from '../global-statistics/unit-formatter/unit-formatter.component';
import {TooltipModule} from 'ng2-tooltip-directive';
import { RowTableComponent } from './components/sasi-table/row-table/row-table.component';
import {AlertFormatterComponent} from '../global-statistics/alert-formatter/alert-formatter.component';

@NgModule({
  declarations: [
    KnobSaComponent,
    IframeUrlCreatorPipe,
    InfoBoxComponent,
    SystemPool2SasiTablePipe,
    SasiTableComponent,
    CellTableComponent,
    FormatterHostDirective,
    RowTableComponent

  ],
  imports: [
    CommonModule,
    KnobModule,
    TooltipModule
  ],
  exports: [
    KnobSaComponent,
    IframeUrlCreatorPipe,
    InfoBoxComponent,
    SystemPool2SasiTablePipe,
    SasiTableComponent
  ],
  entryComponents: [
    SimpleUnitFormatterComponent,
    UnitFormatterComponent,
    AlertFormatterComponent
  ]
})
export class SaCommonModule {
}
