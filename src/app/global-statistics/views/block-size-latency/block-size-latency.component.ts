import {Component, OnInit} from '@angular/core';
import {LatencyMetadata, MetricService} from '../../../metric.service';
import {FilterListDataUtils, SortType} from './filter-list-data.utils';

export interface FilterListData {
  id: number | string;
  name: string;
  systemId: number;
}

enum Quadrant {
  ONE,
  TWO,
  THREE,
  FOUR,
}

@Component({
  selector: 'app-block-size-latency',
  templateUrl: './block-size-latency.component.html',
  styleUrls: ['./block-size-latency.component.css']
})
export class BlockSizeLatencyComponent implements OnInit {

  private latencies: FilterListData[] = [];
  private blockSizes: FilterListData[] = [];
  private dates: FilterListData[] = [];
  private systems: FilterListData[] = [];
  private pools: FilterListData[] = [];
  private selectedDates: string[] = [];
  private selectedSystems: number[] = [];
  private selectedPools: number[] = [];
  private selectedLatencies: number[] = [];
  private selectedBlockSizes: number[] = [];
  private selectedFilters: number[] = [];
  private predefinedFilters = [];
  private filtersName = [];
  private filterColors = [];

  constructor(private readonly metricService: MetricService) {
    this.predefinedFilters[Quadrant.ONE] = {blockSize: [0.5, 1, 2, 4, 8, 16, 32], latency: [0.0625, 0.125, 0.25, 0.5, 1]};
    this.predefinedFilters[Quadrant.TWO] = {blockSize: [64, 128, 256, 512, 1024], latency: [0.0625, 0.125, 0.25, 0.5, 1]};
    this.predefinedFilters[Quadrant.THREE] = {blockSize: [64, 128, 256, 512, 1024], latency: [2, 4, 8, 16, 32, 64, 128, 256]};
    this.predefinedFilters[Quadrant.FOUR] = {blockSize: [0.5, 1, 2, 4, 8, 16, 32], latency: [2, 4, 8, 16, 32, 64, 128, 256]};

    this.filtersName[Quadrant.ONE] = 'SLA-OK-CUS';
    this.filtersName[Quadrant.TWO] = 'SLA-OK-SUP';
    this.filtersName[Quadrant.THREE] = 'BREACH-CUS';
    this.filtersName[Quadrant.FOUR] = 'BREACH-SUP';

    this.filterColors[Quadrant.ONE] = 'btn-success';
    this.filterColors[Quadrant.TWO] = 'btn-success';
    this.filterColors[Quadrant.THREE] = 'btn-danger';
    this.filterColors[Quadrant.FOUR] = 'btn-danger';
    this.latencies = this.setNumberValues([0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256]);
    this.blockSizes = this.setNumberValues([0.5, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
    this.selectedBlockSizes = this.blockSizes.map(value => value.id as number);
    this.selectedLatencies = this.latencies.map(value => value.id as number);
  }


  ngOnInit() {
    this.metricService.getLatencyMetadata().subscribe(
      data => {
        this.dates = FilterListDataUtils.sort(this.setDatesFilters(data), SortType.DESC);
        this.systems = FilterListDataUtils.sort(this.setSystemFilters(data), SortType.ASC);
        this.pools = FilterListDataUtils.sort(this.setPoolFilters(data), SortType.ASC);
      }
    );
  }

  private setNumberValues(data: number[]): FilterListData[] {
    return data.map(value => {
      return {id: value, name: value.toString(), systemId: null};
    });
  }

  private setDatesFilters(data: LatencyMetadata): FilterListData[] {
    return data.dates.map(date => {
      return {id: date, name: date, systemId: null};
    });
  }

  private setSystemFilters(data: LatencyMetadata): FilterListData[] {
    return data.systems.map(
      system => {
        return {id: system.id, name: system.name, systemId: null};
      }
    );
  }

  private setPoolFilters(data: LatencyMetadata) {
    return data.systems.map(
      system => system.children.map(pool => {
        return {id: pool.id, name: pool.name + '@' + system.name, systemId: system.id};
      })
    ).reduce((previousValue, currentValue) => previousValue.concat(...currentValue));
  }

  onDatesChanged(selectedDates: string[]) {
    this.selectedDates = selectedDates.map(val => val);
  }

  onLatenciesChanged(selectedValues: number[]) {
    this.selectedLatencies = selectedValues.map(val => val);
  }

  onBlockSizeChange(selectedValues: number[]) {
    this.selectedBlockSizes = selectedValues.map(val => val);
  }

  onSystemChanged(selectedSystems: string[]) {
    this.selectedSystems = selectedSystems.map(
      val => parseInt(val, 10)
    );
    this.selectedPools = [];
    this.selectedSystems.forEach(
      system => this.selectedPools = this.selectedPools.concat(
        this.pools.filter(pool => pool.systemId === system)
          .map(pool => pool.id as number)
      )
    );
  }

  onSelectFilter(quadrant: Quadrant) {
    if (!this.selectedFilters.includes(quadrant)) {
      this.selectedFilters.push(quadrant);
    } else {
      this.selectedFilters = this.selectedFilters.filter(value => value !== quadrant);
    }
    this.selectedLatencies = [];
    this.selectedBlockSizes = [];
    this.selectedFilters.forEach(
      filter => {
        this.selectedLatencies = [...this.selectedLatencies, ...this.predefinedFilters[filter].latency];
        this.selectedBlockSizes = [...this.selectedBlockSizes, ...this.predefinedFilters[filter].blockSize];
      }
    );

    console.log(this.selectedFilters);
    console.log(this.selectedLatencies);
    console.log(this.selectedBlockSizes);
  }

  onPoolChanged(selectedPools: number[]) {
    this.selectedPools = selectedPools.map(val => val) || [];
    this.selectedSystems = this.systems.filter(systems => this.isAnyPoolSelected(systems.id)).map(system => system.id as number);
  }

  isSelected(quadrant: Quadrant) {
    return this.selectedFilters.includes(quadrant);
  }

  private isAnyPoolSelected(id: number | string) {
    const allPools = this.pools.filter(pool => pool.systemId === id);
    return allPools.some(pool => this.selectedPools.includes(pool.id as number));
  }
}
