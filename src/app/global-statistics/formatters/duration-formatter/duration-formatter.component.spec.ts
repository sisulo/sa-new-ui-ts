import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationFormatterComponent } from './duration-formatter.component';

describe('DurationFormatterComponent', () => {
  let component: DurationFormatterComponent;
  let fixture: ComponentFixture<DurationFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DurationFormatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
