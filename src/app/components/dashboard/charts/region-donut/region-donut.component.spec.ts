import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegionDonutComponent} from './region-donut.component';

describe('RegionDonutComponent', () => {
  let component: RegionDonutComponent;
  let fixture: ComponentFixture<RegionDonutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegionDonutComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
