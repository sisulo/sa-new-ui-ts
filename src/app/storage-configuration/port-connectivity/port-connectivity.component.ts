import {Component, OnDestroy, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {ExtractStorageEntityUtils} from '../utils/extract-storage-entity.utils';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-port-connectivity',
  templateUrl: './port-connectivity.component.html',
  styleUrls: ['./port-connectivity.component.css']
})
export class PortConnectivityComponent implements OnInit, OnDestroy {

  systemsList: Owner[] = [];
  dkcList: Owner[] = [];
  controllerList: Owner[] = [];
  channelBoardList: Owner[] = [];
  portList: Owner[] = [];
  selectedSystem: number;
  typeEnum = StorageEntityType;
  private sub: Subscription;

  constructor(private metricService: MetricService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(
      params => {
        console.log(params);
        if (params['id'] !== undefined) {
          this.selectedSystem = parseInt(params['id'], 10);
          this.loadData();
        }
      }
    );
    this.loadData();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  openSelectedSystem() {
    this.router.navigate(['/storage-config/port-connectivity'], {queryParams: {id: this.selectedSystem}});
  }

  loadData(force: boolean = true) {

    this.fetchStorageEntities(StorageEntityType.SYSTEM, null)
      .subscribe(data => this.systemsList = data.sort((a, b) => this.compare(a, b)));
    if (this.selectedSystem != null) {
      this.fetchStorageEntities(StorageEntityType.DKC, this.selectedSystem)
        .subscribe(data => this.dkcList = data);
      this.fetchStorageEntities(StorageEntityType.CONTROLLER, this.selectedSystem)
        .subscribe(data => this.controllerList = data);
      this.fetchStorageEntities(StorageEntityType.CHANNEL_BOARD, this.selectedSystem)
        .subscribe(data => this.channelBoardList = data);
      this.fetchStorageEntities(StorageEntityType.PORT, this.selectedSystem)
        .subscribe(data => this.portList = data);
    }

  }

  fetchStorageEntities(type, systemId: number): Observable<Owner[]> {
    return new Observable(subscriber =>
      this.metricService.getSystemsDetail(type, systemId)
        .subscribe(data => {
          if (data.length > 0) {
            subscriber.next(ExtractStorageEntityUtils.extractByType(data, type));
          } else {
            subscriber.next([]);
          }
        }));
  }

  getSystemListCurrent(id): Owner[] {
    return this.systemsList.filter(system => system.id === id);
  }

  compare(a, b) {
    const avalue = this.getValue(a);
    const bValue = this.getValue(b);
    if (avalue > bValue) {
      return 1;
    } else if (avalue < bValue) {
      return -1;
    }
    return 0;
  }

  getValue(a) {
    return a.detail != null ? a.detail.sortId : null;
  }
}
