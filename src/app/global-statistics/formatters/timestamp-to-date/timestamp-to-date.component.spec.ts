import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampToDateComponent } from './timestamp-to-date.component';

describe('TimestampToDateComponent', () => {
  let component: TimestampToDateComponent;
  let fixture: ComponentFixture<TimestampToDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimestampToDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimestampToDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
