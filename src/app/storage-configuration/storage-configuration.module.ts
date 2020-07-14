import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StorageLocationComponent} from './storage-location/storage-location.component';
import {StorageConfigurationRoutingModule} from './storage-configuration-routing.module';
import {SaCommonModule} from '../common/sa-common.module';
import {GlobalStatisticsModule} from '../global-statistics/global-statistics.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {SeTextFormatterComponent} from './se-text-formatter/se-text-formatter.component';
import { SerialNumberFormatterComponent } from './serial-number-formatter/serial-number-formatter.component';
import { FormsModule } from '@angular/forms';
import { StorageEntityFormComponent } from './storage-entity-form/storage-entity-form.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    StorageLocationComponent,
    SeTextFormatterComponent,
    SerialNumberFormatterComponent,
    StorageEntityFormComponent
  ],
  entryComponents: [
    SeTextFormatterComponent,
    SerialNumberFormatterComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    SaCommonModule,
    GlobalStatisticsModule,
    StorageConfigurationRoutingModule,
    TooltipModule,
    FormsModule,
  ]
})
export class StorageConfigurationModule {
}
