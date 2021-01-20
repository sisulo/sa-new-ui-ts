import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MetricService} from '../../metric.service';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {ExtractStorageEntityUtils} from '../utils/extract-storage-entity.utils';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBusService} from '../form-bus.service';
import {StorageEntityVo} from '../storage-entity-form/storage-entity-form.component';
import {OnSelectService} from '../../common/components/sasi-table/on-select.service';
import {ComponentStatus} from '../../common/models/dtos/enums/component.status';
import {DataSourceModel, LayoutModel, NodeModel, ConnectorModel} from '@syncfusion/ej2-diagrams';
import { DataManager } from '@syncfusion/ej2-data';
export interface EmployeeInfo {
  Name: string;
  Role: string;
  color: string;
}
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
  statusStorageEntities: ComponentStatus[] = [ComponentStatus.ACTIVE];
  private sub: Subscription;
  public layout: LayoutModel;
  public dataSourceSettings: DataSourceModel;
  public data: Object[] = [
    {
      'Name': 'Elizabeth',
      'Role': 'Director'
    },
    {
      'Name': 'Christina',
      'ReportingPerson': 'Elizabeth',
      'Role': 'Manager'
    },
    {
      Name: 'Yoshi',
      ReportingPerson: 'Christina',
      Role: 'Lead'
    },
    {
      Name: 'Philip',
      ReportingPerson: 'Christina',
      Role: 'Lead'
    },
    {
      Name: 'Yang',
      ReportingPerson: 'Elizabeth',
      Role: 'Manager'
    },
    {
      Name: 'Roland',
      ReportingPerson: 'Yang',
      Role: 'Lead'
    },
    {
      Name: 'Yvonne',
      ReportingPerson: 'Yang',
      Role: 'Lead'
    }
  ];
  constructor(private metricService: MetricService,
              private route: ActivatedRoute,
              private router: Router,
              private formBusService: FormBusService,
              private selectedSasiRows: OnSelectService) {
    this.layout = {
      type: 'HierarchicalTree'
    } as LayoutModel;
    this.dataSourceSettings = {
      id: 'Name',
      parentId: 'ReportingPerson',
      dataManager: new DataManager(this.data)
    } as DataSourceModel;
  }
  public nodeDefaults(node: NodeModel): NodeModel {
    const codes: Object = {
      Director: 'rgb(0, 139,139)',
      Manager: 'rgb(30, 30,113)',
      Lead: 'rgb(0, 100,0)'
    };
    node.width = 70;
    node.height = 30;
    node.annotations = [
      { content: (node.data as EmployeeInfo).Name, style: { color: 'white' } }
    ];
    node.style.fill = codes[(node.data as EmployeeInfo).Role];
    return node;
  }

  public connectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    return connector;
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

    this.fetchStorageEntities(StorageEntityType.SYSTEM, null, [ComponentStatus.ACTIVE])
      .subscribe(data => this.systemsList = data.sort((a, b) => this.compare(a, b)));
    if (this.selectedSystem != null) {
      this.fetchStorageEntities(StorageEntityType.DKC, this.selectedSystem, this.statusStorageEntities)
        .subscribe(data => this.dkcList = data);
      this.fetchStorageEntities(StorageEntityType.CONTROLLER, this.selectedSystem, this.statusStorageEntities)
        .subscribe(data => this.controllerList = data);
      this.fetchStorageEntities(StorageEntityType.CHANNEL_BOARD, this.selectedSystem, this.statusStorageEntities)
        .subscribe(data => this.channelBoardList = data);
      this.fetchStorageEntities(StorageEntityType.PORT, this.selectedSystem, this.statusStorageEntities)
        .subscribe(data => this.portList = data);
      this.selectedSasiRows.announceSelect([]);
    }

  }

  fetchStorageEntities(type, systemId: number, status: ComponentStatus[]): Observable<Owner[]> {
    return new Observable(subscriber =>
      this.metricService.getStorageEntityDetail(type, systemId, status)
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

  toggleStatus() {
    this.statusStorageEntities = this.isActiveStorageEntities() ? [ComponentStatus.ACTIVE] : [ComponentStatus.ACTIVE, ComponentStatus.INACTIVE];
    this.loadData();
  }

  isActiveStorageEntities() {
    return this.statusStorageEntities.some(status => status === ComponentStatus.INACTIVE);
  }
}
