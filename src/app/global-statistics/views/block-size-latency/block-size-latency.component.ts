import {Component, OnInit} from '@angular/core';
import {LatencyMetadata, MetricService} from '../../../metric.service';
import {FilterListDataUtils, SortType} from './filter-list-data.utils';

export interface FilterListData {
  id: number | string;
  name: string;
  systemId: number;
}

@Component({
  selector: 'app-block-size-latency',
  templateUrl: './block-size-latency.component.html',
  styleUrls: ['./block-size-latency.component.css']
})
export class BlockSizeLatencyComponent implements OnInit {

  private dates: FilterListData[] = [];
  private systems: FilterListData[] = [];
  private pools: FilterListData[] = [];
  private selectedDates: string[] = [];
  private selectedSystems: number[] = [];
  private selectedPools: number[] = [];

  constructor(private readonly metricService: MetricService) {
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
      system => system.pools.map(pool => {
        return {id: pool.id, name: pool.name + '@' + system.name, systemId: system.id};
      })
    ).reduce((previousValue, currentValue) => previousValue.concat(...currentValue));
  }

  onDatesChanged(selectedDates: string[]) {
    this.selectedDates = selectedDates.map(val => val);
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

  onPoolChanged(selectedPools: number[]) {
    this.selectedPools = selectedPools.map(val => val) || [];
    this.selectedSystems = this.systems.filter(systems => this.isAnyPoolSelected(systems.id)).map(system => system.id as number);
  }

  private isAnyPoolSelected(id: number | string) {
    const allPools = this.pools.filter(pool => pool.systemId === id);
    return allPools.some(pool => this.selectedPools.includes(pool.id as number));
  }
}
