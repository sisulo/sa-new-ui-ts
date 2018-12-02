import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {InfrastructureDto} from './models/metrics/InfrastructureDto';
import {environment} from '../environments/environment';
import {DatacenterDto} from './models/dtos/DatacenterDto';
import {PerformanceStatisticsDto} from './models/dtos/PerformanceStatisticsDto';
import {CapacityStatisticsDto} from './models/dtos/CapacityStatisticsDto';

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

  getPerformanceStatistics(id: number): Observable<PerformanceStatisticsDto> {
    const url = environment.metricsBaseUrl + 'datacenter/' + id + '/performance.json';
    return this.http.get<PerformanceStatisticsDto>(url);
  }

  getCapacityStatistics(id: number): Observable<CapacityStatisticsDto> {
    const url = environment.metricsBaseUrl + 'datacenter/' + id + '/capacity.json';
    return this.http.get<CapacityStatisticsDto>(url);
  }
}
