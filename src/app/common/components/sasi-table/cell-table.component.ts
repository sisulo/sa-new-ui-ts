import {Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {FormatterHostDirective} from './formatter-host.directive';
import {SasiTableFormatter} from './sasi-table-formatter';
import {SasiRow} from './sasi-table.component';

@Component({
  selector: 'app-cell-table',
  template: '<ng-template appFormatterHost></ng-template>'
})
export class CellTableComponent implements OnInit, OnDestroy {
  @Input() componentFormatter;
  @Input() label;
  @Input() data: SasiRow;
  @Input() options;
  @ViewChild(FormatterHostDirective) adHost: FormatterHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
  }

  loadComponent() {

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentFormatter);

    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<SasiTableFormatter>componentRef.instance).data = this.data;
    (<SasiTableFormatter>componentRef.instance).label = this.label;
    (<SasiTableFormatter>componentRef.instance).options = this.options;
  }
}
