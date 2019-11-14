import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdaptersComponent} from './adapters.component';

describe('AdaptersComponent', () => {
  let component: AdaptersComponent;
  let fixture: ComponentFixture<AdaptersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
