import {Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Menu} from './models/Menu';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnInit {

  data: Menu;

  headers: HttpHeaders;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
  }

  getData(): Observable<Menu> {
    const url = environment.metricsBaseUrl + 'menu.json';
    return this.httpClient.get<Menu>(url);
  }
}
