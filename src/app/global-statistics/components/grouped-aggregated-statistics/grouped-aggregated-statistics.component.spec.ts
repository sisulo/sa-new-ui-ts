import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupedAggregatedStatisticsComponent} from './grouped-aggregated-statistics.component';

describe('AggragatedStatisticsComponent', () => {
  let component: GroupedAggregatedStatisticsComponent;
  let fixture: ComponentFixture<GroupedAggregatedStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedAggregatedStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedAggregatedStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
