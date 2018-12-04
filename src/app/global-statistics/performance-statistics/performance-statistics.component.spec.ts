import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceStatisticsComponent } from './performance-statistics.component';

describe('PerformanceStatisticsComponent', () => {
  let component: PerformanceStatisticsComponent;
  let fixture: ComponentFixture<PerformanceStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
