import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCsvDataComponent } from './import-csv-data.component';

describe('ImportCsvDataComponent', () => {
  let component: ImportCsvDataComponent;
  let fixture: ComponentFixture<ImportCsvDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportCsvDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportCsvDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
