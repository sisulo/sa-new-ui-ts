import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DisbalanceFormatterComponent} from './disbalance-formatter.component';

describe('DisbalanceFormatterComponent', () => {
  let component: DisbalanceFormatterComponent;
  let fixture: ComponentFixture<DisbalanceFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbalanceFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbalanceFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
