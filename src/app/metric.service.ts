import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfrastructureDto} from './common/models/dtos/InfrastructureDto';
import {environment} from '../environments/environment';
import {DatacenterDto} from './common/models/dtos/DatacenterDto';
import {PerformanceStatisticsDto} from './common/models/dtos/PerformanceStatisticsDto';
import {CapacityStatisticsDto} from './common/models/dtos/CapacityStatisticsDto';
import {Datacenter} from './common/models/Datacenter';
import {DatePipe} from '@angular/common';
import {GlobalCapacityStatisticsDto} from './common/models/dtos/GlobalCapacityStatisticsDto';

export enum PeriodType {
  DAY = 0,
  WEEK,
  MONTH
}

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  infrastructure: Datacenter[];
  currentDate: Date = new Date();

  constructor(private http: HttpClient) {
    this.getDatacenters();
  }

  getInfrastructureStats(): Observable<InfrastructureDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/infrastructureMetric.json');
    return this.http.get<InfrastructureDto>(url);
  }

  getDatacenters(): Observable<DatacenterDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters');
    const dtoObservable = this.http.get<DatacenterDto>(url);
    dtoObservable.subscribe(
      dto => this.infrastructure = dto.datacenters
    );
    return dtoObservable;
  }

  public getSystemName(datacenterId: string, systemId: string): string {
    const datacenterObj = this.infrastructure.find(datacenter => datacenter.id.toString() === datacenterId);
    if (datacenterObj === undefined) {
      return '';
    }
    const systemObj = datacenterObj.systems.find(system => system.id.toString() === systemId);
    if (systemObj === undefined) {
      return '';
    }
    return datacenterObj.systems.find(system => system.id.toString() === systemId).name;
  }

  getPerformanceStatistics(id: number, period: PeriodType): Observable<PerformanceStatisticsDto> {
    if (id !== undefined) {
      const url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/performance');
      return this.http.get<PerformanceStatisticsDto>(url);
    }
  }

  getCapacityStatistics(id: number): Observable<CapacityStatisticsDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/capacity');
    return this.http.get<CapacityStatisticsDto>(url);
  }

  getDpSlaStatistics(id: number, period: PeriodType): Observable<CapacityStatisticsDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/sla');
    return this.http.get<CapacityStatisticsDto>(url);
  }

  getAdaptersStatistics(id: number, period: PeriodType): Observable<CapacityStatisticsDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/adapters');
    return this.http.get<CapacityStatisticsDto>(url);
  }

  getGobalCapacityStatistics(): Observable<GlobalCapacityStatisticsDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/capacity');
    return this.http.get<GlobalCapacityStatisticsDto>(url);
  }

  private getSuffix(period: PeriodType) {
    let suffix = '';
    switch (period) {
      case PeriodType.WEEK:
        suffix = '_week';
        break;
      case PeriodType.MONTH:
        suffix = '_month';
        break;
      default:
        suffix = '_day';
    }
    return suffix;
  }

  private buildUrl(baseUrl, basePath) {
    return baseUrl + basePath + '?t=' + this.generateSaltValue() + '&date=' + this.generateDate();
  }

  private generateSaltValue(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateDate(): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(this.currentDate, 'yyyy-MM-dd');
    // return '2019-06-18';
  }
}
