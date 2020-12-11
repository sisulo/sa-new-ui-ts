import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageEntityStatusComponent } from './storage-entity-status.component';

describe('StorageEntityStatusComponent', () => {
  let component: StorageEntityStatusComponent;
  let fixture: ComponentFixture<StorageEntityStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageEntityStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageEntityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
