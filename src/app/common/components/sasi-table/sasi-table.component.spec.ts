import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SasiTableComponent} from './sasi-table.component';

describe('SasiTableComponent', () => {
  let component: SasiTableComponent;
  let fixture: ComponentFixture<SasiTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SasiTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SasiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
