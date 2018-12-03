import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KnobSaComponent} from './components/knob/knob-sa.component';
import {KnobModule} from '@xmlking/ngx-knob';

@NgModule({
  declarations: [
    KnobSaComponent
  ],
  imports: [
    CommonModule,
    KnobModule
  ],
  exports: [
    KnobSaComponent
  ]
})
export class SaCommonModule { }
