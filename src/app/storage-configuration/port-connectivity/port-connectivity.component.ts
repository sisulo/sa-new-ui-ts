import {Component, OnDestroy, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {ExtractStorageEntityUtils} from '../utils/extract-storage-entity.utils';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBusService} from '../form-bus.service';
import {StorageEntityVo} from '../storage-entity-form/storage-entity-form.component';
import {OnSelectService} from '../../common/components/sasi-table/on-select.service';

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
              private router: Router,
              private formBusService: FormBusService,
              private selectedSasiRows: OnSelectService) {
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(
      params => {
        if (params['id'] !== undefined) {
          this.selectedSystem = parseInt(params['id'], 10);
          this.loadData();
        }
      }
    );
    this.selectedSasiRows.selectRows$.subscribe(rows => {
      console.log(rows);
    });
    this.loadData();
  }

  openForm() {
    const data = new StorageEntityVo();
    const system = this.systemsList.find(item => item.id === this.selectedSystem);
    data.id = system.id;
    data.parentId = system.parentId;
    data.type = StorageEntityType[system.type];
    data.duplicateOperation = true;
    this.formBusService.sendFormData({data: data, selectedData: []});
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
      this.selectedSasiRows.announceSelect([]);
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
