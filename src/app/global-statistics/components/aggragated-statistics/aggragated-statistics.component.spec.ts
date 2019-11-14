import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AggragatedStatisticsComponent} from './aggragated-statistics.component';

describe('AggragatedStatisticsComponent', () => {
  let component: AggragatedStatisticsComponent;
  let fixture: ComponentFixture<AggragatedStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AggragatedStatisticsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggragatedStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
