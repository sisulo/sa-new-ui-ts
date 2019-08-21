import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlertFormatterComponent} from './alert-formatter.component';

describe('AlertFormatterComponent', () => {
  let component: AlertFormatterComponent;
  let fixture: ComponentFixture<AlertFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
