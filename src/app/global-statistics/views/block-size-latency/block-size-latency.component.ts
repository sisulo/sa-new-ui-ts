import {Component, OnInit} from '@angular/core';
import {LatencyMetadata, MetricService} from '../../../metric.service';

@Component({
  selector: 'app-block-size-latency',
  templateUrl: './block-size-latency.component.html',
  styleUrls: ['./block-size-latency.component.css']
})
export class BlockSizeLatencyComponent implements OnInit {

  private latencyMetadata: LatencyMetadata;
  private selectedDates: string[];

  constructor(private readonly metricService: MetricService) {
  }


  ngOnInit() {
    this.metricService.getLatencyMetadata().subscribe(
      data => this.latencyMetadata = data
    );
  }

  onDatesChanged(selectedDates: string[]) {
    this.selectedDates = selectedDates.map(val => val);
  }
}
