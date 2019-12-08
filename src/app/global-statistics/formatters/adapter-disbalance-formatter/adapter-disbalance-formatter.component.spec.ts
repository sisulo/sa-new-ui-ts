import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdapterDisbalanceFormatterComponent} from './adapter-disbalance-formatter.component';

describe('AdapterDisbalanceFormatterComponent', () => {
  let component: AdapterDisbalanceFormatterComponent;
  let fixture: ComponentFixture<AdapterDisbalanceFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdapterDisbalanceFormatterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdapterDisbalanceFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
