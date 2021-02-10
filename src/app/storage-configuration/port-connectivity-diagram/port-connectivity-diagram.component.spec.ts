import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortConnectivityDiagramComponent } from './port-connectivity-diagram.component';

describe('PortConnectivityDiagramComponent', () => {
  let component: PortConnectivityDiagramComponent;
  let fixture: ComponentFixture<PortConnectivityDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortConnectivityDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortConnectivityDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
