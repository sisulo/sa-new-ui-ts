import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageLocationComponent} from './storage-location/storage-location.component';
import {StorageConfigurationRoutingModule} from './storage-configuration-routing.module';
import {SaCommonModule} from '../common/sa-common.module';
import {GlobalStatisticsModule} from '../global-statistics/global-statistics.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {SeTextFormatterComponent} from './se-text-formatter/se-text-formatter.component';
import { SerialNumberFormatterComponent } from './serial-number-formatter/serial-number-formatter.component';

@NgModule({
  declarations: [
    StorageLocationComponent,
    SeTextFormatterComponent,
    SerialNumberFormatterComponent
  ],
  entryComponents: [
    SeTextFormatterComponent,
    SerialNumberFormatterComponent
  ],
  imports: [
    CommonModule,
    SaCommonModule,
    GlobalStatisticsModule,
    StorageConfigurationRoutingModule,
    TooltipModule,
  ]
})
export class StorageConfigurationModule {
}
