import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitFormatterComponent } from './unit-formatter.component';

describe('UnitFormatterComponent', () => {
  let component: UnitFormatterComponent;
  let fixture: ComponentFixture<UnitFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
