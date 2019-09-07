import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HostGroupsCapacityComponent} from './host-groups-capacity.component';

describe('HostGroupsCapacityComponent', () => {
  let component: HostGroupsCapacityComponent;
  let fixture: ComponentFixture<HostGroupsCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostGroupsCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostGroupsCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
