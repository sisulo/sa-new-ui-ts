import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GlobalPhysicalCapacityStatisticsComponent} from './global-physical-capacity-statistics.component';

describe('InfrastructureStatisticsComponent', () => {
  let component: GlobalPhysicalCapacityStatisticsComponent;
  let fixture: ComponentFixture<GlobalPhysicalCapacityStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalPhysicalCapacityStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalPhysicalCapacityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
