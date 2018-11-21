import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Infrastructure} from './models/metrics/Infrastructure';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(private http: HttpClient) {
  }

  getInfrastructureStats(): Observable<Infrastructure> {
    const url = 'http://localhost/infrastructureMetric.json';
    return this.http.get<Infrastructure>(url);
  }
}
