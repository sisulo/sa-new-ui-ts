import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Infrastructure} from './models/metrics/Infrastructure';
import {environment} from '../environments/environment';
import {DatacenterDto} from './models/DatacenterDto';
import {PerformanceStatisticsDto} from './models/PerformanceStatisticsDto';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(private http: HttpClient) {
  }

  getInfrastructureStats(): Observable<Infrastructure> {
    const url = environment.metricsBaseUrl + 'infrastructureMetric.json';
    return this.http.get<Infrastructure>(url);
  }

  getDatacenters(): Observable<DatacenterDto> {
    const url = environment.metricsBaseUrl + 'datacenters.json';
    return this.http.get<DatacenterDto>(url);
  }

  getPerformanceStatistics(id: string): Observable<PerformanceStatisticsDto> {
    const url = environment.metricsBaseUrl + 'datacenter/' + id + '/Performance_statistics.json';
    return this.http.get<PerformanceStatisticsDto>(url);
  }
}
