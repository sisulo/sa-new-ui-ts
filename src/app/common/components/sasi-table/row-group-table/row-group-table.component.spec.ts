import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowGroupTableComponent } from './row-group-table.component';

describe('RowGroupTableComponent', () => {
  let component: RowGroupTableComponent;
  let fixture: ComponentFixture<RowGroupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowGroupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
