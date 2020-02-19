import {Component, ComponentFactoryResolver, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';

import {FormatterHostDirective} from './formatter-host.directive';
import {SasiTableFormatter} from './sasi-table-formatter';
import {SasiGroupRow} from './sasi-table.component';

@Component({
  selector: 'app-row-dynamic-table',
  template: '<ng-template appFormatterHost></ng-template>'
})
export class RowDynamicComponent implements OnInit, OnDestroy, OnChanges {
  @Input() componentFormatter;
  @Input() label;
  @Input() data: SasiGroupRow;
  @Input() options;
  @ViewChild(FormatterHostDirective, {static: true}) adHost: FormatterHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
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
