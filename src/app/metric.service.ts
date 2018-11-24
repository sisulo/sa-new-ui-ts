import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Infrastructure} from './models/metrics/Infrastructure';
import {environment} from '../environments/environment';

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
}
