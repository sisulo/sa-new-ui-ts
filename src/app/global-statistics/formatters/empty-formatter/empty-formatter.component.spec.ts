import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EmptyFormatterComponent} from './empty-formatter.component';

describe('EmptyFormatterComponent', () => {
  let component: EmptyFormatterComponent;
  let fixture: ComponentFixture<EmptyFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyFormatterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
