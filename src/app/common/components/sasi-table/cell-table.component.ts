import {Component, ComponentFactoryResolver, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';

import {FormatterHostDirective} from './formatter-host.directive';
import {SasiTableFormatter} from './sasi-table-formatter';
import {SasiColumn, SasiRow} from './sasi-table.component';

@Component({
  selector: 'app-cell-table',
  template: '<ng-template appFormatterHost></ng-template>'
})
export class CellTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() componentFormatter;
  @Input() label;
  @Input() data: SasiRow;
  @Input() options;
  @Input() column: SasiColumn;
  @ViewChild(FormatterHostDirective) adHost: FormatterHostDirective;

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
    (<SasiTableFormatter>componentRef.instance).column = this.column;
  }


}
