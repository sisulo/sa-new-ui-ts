import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CapacityHistoryChartComponent} from './capacity-history-chart.component';

describe('CapacityHistoryChartComponent', () => {
  let component: CapacityHistoryChartComponent;
  let fixture: ComponentFixture<CapacityHistoryChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CapacityHistoryChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityHistoryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
