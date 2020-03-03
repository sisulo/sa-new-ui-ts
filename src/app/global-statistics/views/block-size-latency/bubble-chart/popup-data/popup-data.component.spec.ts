import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PopupDataComponent} from './popup-data.component';

describe('PopupDataComponent', () => {
  let component: PopupDataComponent;
  let fixture: ComponentFixture<PopupDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupDataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
