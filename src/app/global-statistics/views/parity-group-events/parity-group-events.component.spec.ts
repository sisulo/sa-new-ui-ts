import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParityGroupEventsComponent } from './parity-group-events.component';

describe('ParityGroupEventsComponent', () => {
  let component: ParityGroupEventsComponent;
  let fixture: ComponentFixture<ParityGroupEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParityGroupEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParityGroupEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
