import {Component, OnInit} from '@angular/core';
import {
  BasicShapeModel,
  ConnectorModel,
  DataSourceModel,
  LayoutModel,
  NodeModel,
  TreeInfo,
  SnapSettingsModel
} from '@syncfusion/ej2-diagrams';
import {DataManager} from '@syncfusion/ej2-data';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../metric.service';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {ComponentStatus} from '../../common/models/dtos/enums/component.status';

export interface StorageEntitDiagramData {
  id: string;
  parentId: string;
  name: string;
  type: StorageEntityType;
}

@Component({
  selector: 'app-port-connectivity-diagram',
  templateUrl: './port-connectivity-diagram.component.html',
  styleUrls: ['./port-connectivity-diagram.component.css']
})
export class PortConnectivityDiagramComponent implements OnInit {

  static bgColor = {
    DATACENTER: 'rgb(255, 255, 255)',
    SYSTEM: 'rgb(219, 219, 219)',
    DKC: 'rgb(218, 197, 219)',
    CONTROLLER: 'rgb(214, 233, 213)',
    CHANNEL_BOARD: 'rgb(218, 233, 252)',
    PORT: 'rgb(255, 230, 205)'
  };
  static strokeColor = {
    DATACENTER: 'rgb(164, 164, 164)',
    SYSTEM: 'rgb(164, 164, 164)',
    DKC: 'rgb(217, 163, 220)',
    CONTROLLER: 'rgb(154, 228, 146)',
    CHANNEL_BOARD: 'rgb(168, 204, 251)',
    PORT: 'rgb(255, 192, 106)'
  };
  static shape = {
    DATACENTER: 'Rectangle',
    SYSTEM: 'Rectangle',
    DKC: 'Rectangle',
    CONTROLLER: 'Rectangle',
    CHANNEL_BOARD: 'Rectangle',
    PORT: 'Octagon'
  };
  static size = {
    PORT: {width: 35, height: 35},
  };

  public layout: LayoutModel;
  public dataSourceSettings: DataSourceModel;
  public data: Object[] = [];
  public snapSettings: SnapSettingsModel;
  private selectedSystem: number;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        console.log(params);
        if (params['id'] != undefined) {
          this.selectedSystem = params['id'];
          this.metricService.getStorageEntityDetail(StorageEntityType.PORT, this.selectedSystem, [ComponentStatus.ACTIVE]).subscribe(
            data => {
              this.data = this.transform(data[0].storageEntity);
              this.snapSettings = {
                constraints: 0
              };
              this.layout = {
                type: 'OrganizationalChart',
                horizontalAlignment: 'Stretch',
                margin: {
                  top: 20
                },
                getLayoutInfo: (node: Node, tree: TreeInfo) => {
                  if (!tree.hasSubTree) {
                    tree.orientation = 'Vertical';
                    tree.type = 'Right';
                  }
                }
                // verticalSpacing: 100
              } as LayoutModel;
              this.dataSourceSettings = {
                id: 'id',
                parentId: 'parentId',
                dataManager: new DataManager(this.data)
              } as DataSourceModel;
            }
          );
        }
      }
    );
  }

  public nodeDefaults(node: NodeModel): NodeModel {

    // node.height = 50;
    // node.borderColor = 'white';
    // node.backgroundColor = '#6BA5D7';
    // node.borderWidth = 1;
    // node.style = {
    //   fill: 'transparent',
    //   strokeWidth: 2
    // };
    let bgColor = 'black';
    let strokeColor = 'black';
    let shape = 'Rectangle';
    const data = node.data as StorageEntitDiagramData;
    if (PortConnectivityDiagramComponent.bgColor[data.type] != null) {
      bgColor = PortConnectivityDiagramComponent.bgColor[data.type];
    }
    if (PortConnectivityDiagramComponent.strokeColor[data.type] != null) {
      strokeColor = PortConnectivityDiagramComponent.strokeColor[data.type];
    }
    if (PortConnectivityDiagramComponent.shape[data.type] != null) {
      shape = PortConnectivityDiagramComponent.shape[data.type];
    }
    node.expandIcon = {
      height: 15,
      width: 15,
      shape: 'Plus',
      fill: bgColor,
      borderColor: strokeColor,
      offset: {
        x: .5,
        y: .85
      }
    };
    node.collapseIcon.offset = {
      x: .5,
      y: .85
    };
    node.collapseIcon.height = 15;
    node.collapseIcon.width = 15;
    node.collapseIcon.shape = 'Minus';
    node.collapseIcon.fill = bgColor;
    node.collapseIcon.borderColor = strokeColor;
    node.annotations = [
      {content: (node.data as StorageEntitDiagramData).name, style: {color: 'black'}}
    ];
    node.shape = {
      type: 'Basic',
      shape: shape
    } as BasicShapeModel;
    node.style.fill = bgColor;
    node.style.strokeColor = strokeColor;
    node.style.strokeWidth = 2;
    if (PortConnectivityDiagramComponent.size[data.type] != null) {
      const size = PortConnectivityDiagramComponent.size[data.type];
      node.width = size.width;
      node.height = size.height;
    }

    return node;
  }

  public connectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    return connector;
  }

  private transform(data: Owner) {
    const result = [];
    result.push({id: data.id, parentId: data.parentId, name: data.name, type: data.type});
    if (data.children.length > 0) {
      data.children.forEach(owner => {
        const ownerData = this.transform(owner);
        result.push(...ownerData);
      });
    }
    return result;
  }
}
