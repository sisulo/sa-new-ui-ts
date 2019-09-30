import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfrastructureDto} from './common/models/dtos/InfrastructureDto';
import {environment} from '../environments/environment';
import {DatacenterDto} from './common/models/dtos/DatacenterDto';
import {Datacenter} from './common/models/Datacenter';
import {DatePipe} from '@angular/common';
import {GlobalCapacityStatisticsDto} from './common/models/dtos/GlobalCapacityStatisticsDto';
import {DatacenterListDto} from './common/models/dtos/datacenter-list.dto';
import {DatacenterCapacityListDto} from './common/models/dtos/datacenter-capacity-list.dto';

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
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/alerts');
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

  public getSystemName(datacenterId: number, systemId: number): string {
    const datacenterObj = this.infrastructure.find(datacenter => datacenter.id === datacenterId);
    if (datacenterObj === undefined) {
      return '';
    }
    const systemObj = datacenterObj.systems.find(system => system.id === systemId);
    if (systemObj === undefined) {
      return '';
    }
    return datacenterObj.systems.find(system => system.id === systemId).name;
  }

  getPerformanceStatistics(id: number, period: PeriodType): Observable<DatacenterListDto> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/performance');
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/performance');
    }
    return this.http.get<DatacenterListDto>(url);
  }

  getCapacityStatistics(id: number): Observable<DatacenterCapacityListDto> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/capacity');
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/capacity');
    }
    return this.http.get<DatacenterCapacityListDto>(url);
  }

  getDpSlaStatistics(id: number, period: PeriodType): Observable<DatacenterCapacityListDto> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/sla');
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/sla');
    }
    return this.http.get<DatacenterCapacityListDto>(url);
  }

  getAdaptersStatistics(id: number, period: PeriodType): Observable<DatacenterCapacityListDto> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/adapters');
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/adapters');
    }
    return this.http.get<DatacenterCapacityListDto>(url);
  }

  getGlobalCapacityStatistics(): Observable<GlobalCapacityStatisticsDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/capacity');
    return this.http.get<GlobalCapacityStatisticsDto>(url);
  }

  getGlobalHostGroupCapacityStatistics(): Observable<GlobalCapacityStatisticsDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/host-group-capacity');
    return this.http.get<GlobalCapacityStatisticsDto>(url);
  }

  getHostGroupCapacityStatistics(id: number): Observable<DatacenterCapacityListDto> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/host-groups');
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/host-groups');
    }
    return this.http.get<DatacenterCapacityListDto>(url);
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
  }
}
