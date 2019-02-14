import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KnobSaComponent} from './components/knob/knob-sa.component';
import {KnobModule} from '@xmlking/ngx-knob';
import { IframeUrlCreatorPipe } from './utils/iframe-url-creator.pipe';
import { InfoBoxComponent } from './components/info-box/info-box.component';

@NgModule({
  declarations: [
    KnobSaComponent,
    IframeUrlCreatorPipe,
    InfoBoxComponent
  ],
  imports: [
    CommonModule,
    KnobModule
  ],
  exports: [
    KnobSaComponent,
    IframeUrlCreatorPipe,
    InfoBoxComponent
  ]
})
export class SaCommonModule { }
