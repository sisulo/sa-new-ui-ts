import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeTextFormatterComponent } from './se-text-formatter.component';

describe('SeTextFormatterComponent', () => {
  let component: SeTextFormatterComponent;
  let fixture: ComponentFixture<SeTextFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeTextFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeTextFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
