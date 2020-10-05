import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfrastructureDto} from './common/models/dtos/infrastructure.dto';
import {environment} from '../environments/environment';
import {DatePipe} from '@angular/common';
import {SystemMetricType} from './common/models/metrics/system-metric-type.enum';
import {GraphDataDto} from './common/models/dtos/graph-data.dto';
import {OperationType} from './common/models/metrics/operation-type.enum';
import {SystemPool} from './common/models/system-pool.vo';
import {StorageEntityResponseDto} from './common/models/dtos/storage-entity-response.dto';
import {StorageEntityMetricDto} from './common/models/dtos/storage-entity-metric.dto';
import {StorageEntityRequestDto} from './common/models/dtos/storage-entity-request.dto';
import {StorageEntityDetailRequestDto} from './common/models/dtos/storage-entity-detail-request.dto';
import {ChangeStatusRequestDto} from './common/models/dtos/change-status-request.dto';

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

  constructor(private http: HttpClient) {
    this.getDataCenters();
  }

  infrastructure: StorageEntityResponseDto[];
  dataCenterObservable = null;
  currentDate: Date = new Date();

  static generateSaltValue(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  getInfrastructureStats(): Observable<InfrastructureDto> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/alerts');
    return this.http.get<InfrastructureDto>(url);
  }

  getDataCenters(): Observable<StorageEntityResponseDto[]> {
    if (this.dataCenterObservable !== null) {
      return this.dataCenterObservable;
    }
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters');
    this.dataCenterObservable = this.http.get<StorageEntityResponseDto[]>(url);
    this.dataCenterObservable.subscribe(
      dto => this.infrastructure = dto
    );
    return this.dataCenterObservable;
  }

  public getSystemName(datacenterId: number, systemId: number): string {
    const datacenterObj = this.infrastructure.find(datacenter => datacenter.storageEntity.id === datacenterId);
    if (datacenterObj === undefined) {
      return '';
    }
    const systemObj = datacenterObj.storageEntity.children.find(system => system.id === systemId);
    if (systemObj === undefined) {
      return '';
    }
    return systemObj.name;
  }

  getPerformanceStatistics(id: number, period: PeriodType): Observable<StorageEntityMetricDto[]> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/performance', period);
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/performance', period);
    }
    return this.http.get<StorageEntityMetricDto[]>(url);
  }

  getCapacityStatistics(id: number): Observable<StorageEntityMetricDto[]> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/capacity');
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/capacity');
    }
    return this.http.get<StorageEntityMetricDto[]>(url);
  }

  getDpSlaStatistics(id: number, period: PeriodType): Observable<StorageEntityMetricDto[]> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/sla', period);
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/sla', period);
    }
    return this.http.get<StorageEntityMetricDto[]>(url);
  }

  getAdaptersStatistics(id: number, period: PeriodType): Observable<StorageEntityMetricDto[]> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/adapters', period);
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/adapters', period);
    }
    return this.http.get<StorageEntityMetricDto[]>(url);
  }

  getGlobalCapacityStatistics(): Observable<StorageEntityMetricDto[]> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/capacity');
    return this.http.get<StorageEntityMetricDto[]>(url);
  }

  getGlobalHostGroupCapacityStatistics(): Observable<StorageEntityMetricDto[]> {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/infrastructure/host-group-capacity');
    return this.http.get<StorageEntityMetricDto[]>(url);
  }

  getHostGroupCapacityStatistics(id: number): Observable<StorageEntityMetricDto[]> {
    let url;
    if (id !== undefined && id !== -1) {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/' + id + '/host-groups');
    } else {
      url = this.buildUrl(environment.metricsBaseUrl, '/v1/datacenters/host-groups');
    }
    return this.http.get<StorageEntityMetricDto[]>(url);
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
    const request: LatencyFilter = {
      operations: operationTypes,
      dates: datesIn,
      poolIds: poolIdsIn,
      latencies: latencies,
      blockSizes: blockSizes
    };
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/latency/data');
    const headersParams = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<OperationData[]>(url, request, {headers: headersParams});
  }

  getSystemsDetail() {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v2/storage-entities');
    return this.http.get<StorageEntityResponseDto[]>(url);
  }

  getLatencyMetadata() {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v1/latency/metadata');
    return this.http.get<LatencyMetadata>(url);
  }

  getParityGroupEvents(id: number, period: PeriodType): Observable<StorageEntityMetricDto[]> {
    let url;
    if (id !== undefined && id !== -1) {
      url = environment.metricsBaseUrl + '/v1/datacenters/' + id + '/parity-groups/events';
    } else {
      url = environment.metricsBaseUrl + '/v1/datacenters/parity-groups/events';
    }
    const toDate = new Date().getTime();
    const fromDate = this.calculateDateByPeriodType(new Date(), period);
    const httpParams = new HttpParams()
      .append('toDate', toDate.toString())
      .append('fromDate', fromDate.toString());
    return this.http.get<StorageEntityMetricDto[]>(url, {params: httpParams});
  }

  createStorageEntity(dto: StorageEntityRequestDto) {
    const url = this.buildUrl(environment.metricsBaseUrl, '/v2/storage-entities');
    return this.http.post<StorageEntityResponseDto>(url, dto);
  }

  updateStorageEntity(id: number, dto: StorageEntityDetailRequestDto) {
    const url = environment.metricsBaseUrl + '/v2/storage-entities/' + id;
    return this.http.put<StorageEntityResponseDto>(url, dto);
  }

  moveStorageEntity(id: number, parentId: number) {
    const url = environment.metricsBaseUrl + '/v2/storage-entities/' + id + '/new-parent/' + parentId;
    return this.http.put<any>(url, null);
  }

  private buildUrl(baseUrl, basePath, period?) {
    let periodParam = '';
    if (period != null) {
      periodParam = 'period=' + period + '&';
    }
    return baseUrl + basePath + '?' + periodParam + 't=' + MetricService.generateSaltValue() + '&date=' + this.generateDate();
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

  deleteStorageEntity(id: number) {
    const url = environment.metricsBaseUrl + '/v2/storage-entities/' + id;
    return this.http.delete<any>(url);
  }

  updateStatus(id: number, dto: ChangeStatusRequestDto) {
    const url = environment.metricsBaseUrl + '/v2/storage-entities/' + id + '/status';
    return this.http.put<any>(url, dto);
  }

  calculateDateByPeriodType(date: Date, period: PeriodType): number {
    let days: number;
    switch (period) {
      case PeriodType.DAY:
        days = 1;
        break;
      case PeriodType.MONTH:
        days = 30;
        break;
      case PeriodType.WEEK:
        days = 7;
        break;
      default:
        days = 0;
    }
    return this.calculateDate(date, days);
  }

  calculateDate(date: Date, minusDays: number) {
    return date.getTime() - (minusDays * 24 * 60 * 60 * 1000);
  }
}
