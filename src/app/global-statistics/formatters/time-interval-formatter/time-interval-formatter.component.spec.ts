import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeIntervalFormatterComponent } from './time-interval-formatter.component';

describe('TimeIntervalFormatterComponent', () => {
  let component: TimeIntervalFormatterComponent;
  let fixture: ComponentFixture<TimeIntervalFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeIntervalFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeIntervalFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
