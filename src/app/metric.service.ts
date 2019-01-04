import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfrastructureDto} from './models/metrics/InfrastructureDto';
import {environment} from '../environments/environment';
import {DatacenterDto} from './models/dtos/DatacenterDto';
import {PerformanceStatisticsDto} from './models/dtos/PerformanceStatisticsDto';
import {CapacityStatisticsDto} from './models/dtos/CapacityStatisticsDto';

export enum PeriodType {
  DAY = 0,
  WEEK,
  MONTH
}

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(private http: HttpClient) {
  }

  getInfrastructureStats(): Observable<InfrastructureDto> {
    const url = environment.metricsBaseUrl + 'infrastructureMetric.json';
    return this.http.get<InfrastructureDto>(url);
  }

  getDatacenters(): Observable<DatacenterDto> {
    const url = environment.metricsBaseUrl + 'datacenters.json';
    return this.http.get<DatacenterDto>(url);
  }

  getPerformanceStatistics(id: number, period: PeriodType): Observable<PerformanceStatisticsDto> {
    const url = environment.metricsBaseUrl + 'datacenter/' + id + '/performance' + this.getSuffix(period) + '.json';
    return this.http.get<PerformanceStatisticsDto>(url);
  }

  getCapacityStatistics(id: number): Observable<CapacityStatisticsDto> {
    const url = environment.metricsBaseUrl + 'datacenter/' + id + '/capacity.json';
    return this.http.get<CapacityStatisticsDto>(url);
  }

  private getSuffix(period: PeriodType) {
    let suffix = '';
    switch (period) {
      case PeriodType.WEEK:
        suffix = '-weekly';
        break;
      case PeriodType.MONTH:
        suffix = '-monthly';
        break;
      default:
        suffix = '';
    }
    return suffix;
  }
}
