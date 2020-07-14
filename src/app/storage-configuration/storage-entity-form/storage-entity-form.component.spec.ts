import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageEntityFormComponent } from './storage-entity-form.component';

describe('StorageEntityFormComponent', () => {
  let component: StorageEntityFormComponent;
  let fixture: ComponentFixture<StorageEntityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageEntityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageEntityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
