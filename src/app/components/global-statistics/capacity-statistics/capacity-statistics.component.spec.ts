import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityStatisticsComponent } from './capacity-statistics.component';

describe('CapacityStatisticsComponent', () => {
  let component: CapacityStatisticsComponent;
  let fixture: ComponentFixture<CapacityStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacityStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
