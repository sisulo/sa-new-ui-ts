import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmphFormatterComponent} from './emph-formatter.component';

describe('EmphFormatterComponent', () => {
  let component: EmphFormatterComponent;
  let fixture: ComponentFixture<EmphFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmphFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmphFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
