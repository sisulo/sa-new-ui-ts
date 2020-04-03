import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfrastructureDto} from './common/models/dtos/infrastructure.dto';
import {environment} from '../environments/environment';
import {DatacenterDto} from './common/models/dtos/datacenter.dto';
import {Datacenter} from './common/models/datacenter.vo';
import {DatePipe} from '@angular/common';
import {GlobalCapacityStatisticsDto} from './common/models/dtos/global-capacity-statistics.dto';
import {DatacenterListDto} from './common/models/dtos/datacenter-list.dto';
import {DatacenterCapacityListDto} from './common/models/dtos/datacenter-capacity-list.dto';
import {SystemMetricType} from './common/models/metrics/system-metric-type.enum';
import {GraphDataDto} from './common/models/dtos/graph-data.dto';
import {OperationType} from './common/models/metrics/operation-type.enum';
import {SystemPool} from './common/models/system-pool.vo';

export enum PeriodType {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH'
}

export interface LatencyFilter {
  poolIds: number[];
  dates: string[];
  operations: string[];
  latencies: number[];
  blockSizes: number[];
}

export interface OperationData {
  values: ThreeDimensionValue[];
  operation: OperationType;
}

export interface LatencyMetadata {
  dates: string[]; // Instead of date string is used because locale didn't set correctly
  systems: Array<Partial<SystemPool>>;
}

export interface ThreeDimensionValue {
  x: number;
  y: number;
  z: number;
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
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/performance', period);
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/performance', period);
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
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/sla', period);
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/sla', period);
    }
    return this.http.get<DatacenterCapacityListDto>(url);
  }

  getAdaptersStatistics(id: number, period: PeriodType): Observable<DatacenterCapacityListDto> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/adapters', period);
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/adapters', period);
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

  getGraphData(types: SystemMetricType[]): Observable<GraphDataDto> {
    let url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/performance/graph');
    url = url + this.convertTypeToUrlParams('types', types);
    return this.http.get<GraphDataDto>(url);
  }

  getCapacityGraphData(types: SystemMetricType[]): Observable<GraphDataDto> {
    let url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/capacity/graph');
    url = url + this.convertTypeToUrlParams('types', types);
    return this.http.get<GraphDataDto>(url);
  }

  getLatencyData(poolIdsIn: number[], datesIn: string[], operationTypes: string[], blockSizes: number[], latencies: number[]) {
    const request: LatencyFilter = {operations: operationTypes, dates: datesIn, poolIds: poolIdsIn, latencies: latencies, blockSizes: blockSizes};
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/latency/data');
    const headersParams = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<OperationData[]>(url, request, {headers: headersParams});
  }

  getLatencyMetadata() {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/latency/metadata');
    return this.http.get<LatencyMetadata>(url);
  }

  private buildUrl(baseUrl, basePath, period?) {
    let periodParam = '';
    if (period != null) {
      periodParam = 'period=' + period + '&';
    }
    return baseUrl + basePath + '?' + periodParam + 't=' + this.generateSaltValue() + '&date=' + this.generateDate();
  }

  private generateSaltValue(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private generateDate(): string {
    const pipe = new DatePipe('en-US');
    return pipe.transform(this.currentDate, 'yyyy-MM-dd');
  }

  private convertTypeToUrlParams(paramName: string, types: SystemMetricType[]) {
    const paramNameUrl = '&' + paramName + '[]=';
    return types.reduce(
      (previous, current) => {
        return previous + paramNameUrl + current;
      }, ''
    );
  }
}
