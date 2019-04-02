import {Directive, EventEmitter, Output, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appFormatterHost]'
})
export class FormatterHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
