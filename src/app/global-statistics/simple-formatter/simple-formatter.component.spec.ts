import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormatterComponent } from './simple-formatter.component';

describe('SimpleFormatterComponent', () => {
  let component: SimpleFormatterComponent;
  let fixture: ComponentFixture<SimpleFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
