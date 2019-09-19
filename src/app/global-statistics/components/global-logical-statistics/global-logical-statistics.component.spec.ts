import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GlobalLogicalStatisticsComponent} from '../grouped-aggregated-statistics/global-logical-statistics.component';

describe('GlobalLogicalStatisticsComponent', () => {
  let component: GlobalLogicalStatisticsComponent;
  let fixture: ComponentFixture<GlobalLogicalStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalLogicalStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalLogicalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
