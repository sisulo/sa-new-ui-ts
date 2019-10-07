import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RouteLinkFormatterComponent} from './route-link-formatter.component';

describe('RouteLinkFormatterComponent', () => {
  let component: RouteLinkFormatterComponent;
  let fixture: ComponentFixture<RouteLinkFormatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RouteLinkFormatterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteLinkFormatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
