import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DpSlaComponent } from './dp-sla.component';

describe('DpSlaComponent', () => {
  let component: DpSlaComponent;
  let fixture: ComponentFixture<DpSlaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DpSlaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DpSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
