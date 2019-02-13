import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KnobSaComponent} from './components/knob/knob-sa.component';
import {KnobModule} from '@xmlking/ngx-knob';
import { IframeUrlCreatorPipe } from './utils/iframe-url-creator.pipe';

@NgModule({
  declarations: [
    KnobSaComponent,
    IframeUrlCreatorPipe
  ],
  imports: [
    CommonModule,
    KnobModule
  ],
  exports: [
    KnobSaComponent,
    IframeUrlCreatorPipe
  ]
})
export class SaCommonModule { }
