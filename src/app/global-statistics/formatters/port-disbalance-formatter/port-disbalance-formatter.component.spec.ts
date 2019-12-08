import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PortDisbalanceFormatterComponent} from './port-disbalance-formatter.component';

describe('DisbalanceFormatterComponent', () => {
  let component: PortDisbalanceFormatterComponent;
  let fixture: ComponentFixture<PortDisbalanceFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PortDisbalanceFormatterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortDisbalanceFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
