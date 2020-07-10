import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerialNumberFormatterComponent } from './serial-number-formatter.component';

describe('SerialNumberFormatterComponent', () => {
  let component: SerialNumberFormatterComponent;
  let fixture: ComponentFixture<SerialNumberFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerialNumberFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerialNumberFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
