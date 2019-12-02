import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TierFormatterComponent} from './tier-formatter.component';

describe('TierFormatterComponent', () => {
  let component: TierFormatterComponent;
  let fixture: ComponentFixture<TierFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TierFormatterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
