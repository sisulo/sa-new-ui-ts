import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlockSizeLatencyComponent} from './block-size-latency.component';

describe('BlockSizeLatencyComponent', () => {
  let component: BlockSizeLatencyComponent;
  let fixture: ComponentFixture<BlockSizeLatencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockSizeLatencyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockSizeLatencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
