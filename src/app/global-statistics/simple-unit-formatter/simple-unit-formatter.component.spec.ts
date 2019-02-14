import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleUnitFormatterComponent } from './simple-unit-formatter.component';

describe('SimpleUnitFormatterComponent', () => {
  let component: SimpleUnitFormatterComponent;
  let fixture: ComponentFixture<SimpleUnitFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleUnitFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleUnitFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
