import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatedStatisticsComponent } from './aggregated-statistics.component';

describe('AggregatedStatisticsComponent', () => {
  let component: AggregatedStatisticsComponent;
  let fixture: ComponentFixture<AggregatedStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregatedStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregatedStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
