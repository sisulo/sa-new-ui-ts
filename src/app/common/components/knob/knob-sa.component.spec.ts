import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KnobSaComponent} from './knob-sa.component';

describe('KnobSaComponent', () => {
  let component: KnobSaComponent;
  let fixture: ComponentFixture<KnobSaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KnobSaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnobSaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
