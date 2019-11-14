import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PhysicalCapacityStatisticsComponent} from './physical-capacity-statistics.component';

describe('CapacityStatisticsComponent', () => {
  let component: PhysicalCapacityStatisticsComponent;
  let fixture: ComponentFixture<PhysicalCapacityStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicalCapacityStatisticsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalCapacityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
