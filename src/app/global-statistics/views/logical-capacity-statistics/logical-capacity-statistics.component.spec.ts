import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LogicalCapacityStatisticsComponent} from './logical-capacity-statistics.component';

describe('PhysicalStatisticsComponent', () => {
  let component: LogicalCapacityStatisticsComponent;
  let fixture: ComponentFixture<LogicalCapacityStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogicalCapacityStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicalCapacityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
