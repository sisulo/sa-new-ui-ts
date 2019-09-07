import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GlobalHostGroupCapacityComponent} from './global-host-group-capacity.component';

describe('GlobalHostGroupCapacityComponent', () => {
  let component: GlobalHostGroupCapacityComponent;
  let fixture: ComponentFixture<GlobalHostGroupCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalHostGroupCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalHostGroupCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
