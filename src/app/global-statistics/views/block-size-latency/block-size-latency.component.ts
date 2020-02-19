import {Component, OnInit} from '@angular/core';
import {LatencyMetadata, MetricService} from '../../../metric.service';

@Component({
  selector: 'app-block-size-latency',
  templateUrl: './block-size-latency.component.html',
  styleUrls: ['./block-size-latency.component.css']
})
export class BlockSizeLatencyComponent implements OnInit {

  private dates: string[] = [];
  private systems: { id: number, name: string }[] = [];
  private pools: { id: number, name: string, systemId: number }[] = [];
  private selectedDates: string[] = [];
  private selectedSystems: number[] = [];
  private selectedPools: number[] = [];

  constructor(private readonly metricService: MetricService) {
  }


  ngOnInit() {
    this.metricService.getLatencyMetadata().subscribe(
      data => {
        this.dates = data.dates;
        this.systems = this.setSystemFilters(data);
        this.pools = this.setPoolFilters(data);
      }
    );
  }

  onDatesChanged(selectedDates: string[]) {
    this.selectedDates = selectedDates.map(val => val);
    console.log('BlockSizeComp: ' + selectedDates);
  }

  private setSystemFilters(data: LatencyMetadata) {
    return data.systems.map(
      system => {
        return {id: system.id, name: system.name};
      }
    );
  }

  onSystemChanged(selectedSystems: string[]) {
    this.selectedSystems = selectedSystems.map(val => parseInt(val, 10));
    console.log(selectedSystems);
    this.selectedSystems.forEach(system => this.selectedPools = this.selectedPools.concat(this.pools.filter(pool => pool.systemId === system).map(pool => pool.id)));
    console.log(this.selectedPools);
  }

  private setPoolFilters(data: LatencyMetadata) {
    return data.systems.map(
      system => system.pools.map(pool => {
        return {id: pool.id, name: pool.name + '@' + system.name, systemId: system.id};
      })
    ).reduce((previousValue, currentValue) => previousValue.concat(...currentValue));
  }

  onPoolChanged(selectedPools: string[]) {
    this.selectedPools = selectedPools.map(val => parseInt(val, 10)) || [];
  }
}
