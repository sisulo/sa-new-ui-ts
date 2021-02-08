import {Component, OnInit} from '@angular/core';
import {
  BasicShapeModel,
  ConnectorModel,
  DataSourceModel,
  LayoutModel,
  NodeConstraints,
  NodeModel,
  SnapSettingsModel,
  TreeInfo
} from '@syncfusion/ej2-diagrams';
import {DataManager} from '@syncfusion/ej2-data';
import {ActivatedRoute, Router} from '@angular/router';
import {MetricService} from '../../metric.service';
import {Owner, StorageEntityType} from '../../common/models/dtos/owner.dto';
import {ComponentStatus} from '../../common/models/dtos/enums/component.status';
import {StorageEntityDetailResponseDto} from '../../common/models/dtos/storage-entity-detail-response.dto';

export interface StorageEntitDiagramData {
  id: string;
  parentId: string;
  name: string;
  type: StorageEntityType;
}

interface DiagramShape {
  type: BasicShapeModel;
  radiusCorner: number;
}

@Component({
  selector: 'app-port-connectivity-diagram',
  templateUrl: './port-connectivity-diagram.component.html',
  styleUrls: ['./port-connectivity-diagram.component.css']
})
export class PortConnectivityDiagramComponent implements OnInit {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService
  ) {
  }

  static bgColor = {
    DATACENTER: 'rgb(219, 219, 219)',
    SYSTEM: 'rgb(246,190,192)',
    DKC: 'rgb(218, 197, 219)',
    CONTROLLER: 'rgb(214, 233, 213)',
    CHANNEL_BOARD: 'rgb(218, 233, 252)',
    PORT: 'rgb(255, 230, 205)'
  };
  static strokeColor = {
    DATACENTER: 'rgb(164, 164, 164)',
    SYSTEM: 'rgb(243,142,145)',
    DKC: 'rgb(217, 163, 220)',
    CONTROLLER: 'rgb(154, 228, 146)',
    CHANNEL_BOARD: 'rgb(168, 204, 251)',
    PORT: 'rgb(255, 192, 106)'
  };
  static shape = {
    DATACENTER: {type: 'Rectangle', radiusCorner: 10} as DiagramShape,
    SYSTEM: {type: 'Rectangle', radiusCorner: 10} as DiagramShape,
    DKC: {type: 'Rectangle', radiusCorner: 10} as DiagramShape,
    CONTROLLER: {type: 'Rectangle', radiusCorner: 10} as DiagramShape,
    CHANNEL_BOARD: {type: 'Rectangle', radiusCorner: 10} as DiagramShape,
    PORT: {type: 'Octagon', radiusCorner: 0}
  };
  static size = {
    PORT: {width: 35, height: 35},
    DKC: {width: 100, height: 50},
    CHANNEL_BOARD: {width: 100, height: 50},
    CONTROLLER: {width: 100, height: 50},
    SYSTEM: {width: 120, height: 50},
    DATACENTER: {width: 120, height: 50}
  };

  public layout: LayoutModel;
  public dataSourceSettings: DataSourceModel;
  public data: Object[] = [];
  public snapSettings: SnapSettingsModel;
  private selectedSystem: number;

  public static getContent(node: NodeModel): HTMLElement {

    let tooltipContent: HTMLElement = null;
    console.log(node.data);
    if (node.data != null && (node.data as Owner).detail != null) {
      const detail = (node.data as Owner).detail as StorageEntityDetailResponseDto;
      tooltipContent = document.createElement('div');
      const tooltipItems = [
        PortConnectivityDiagramComponent.getTooltipItem('Array model', detail.arrayModel),
        PortConnectivityDiagramComponent.getTooltipItem('DKC', detail.dkc),
        PortConnectivityDiagramComponent.getTooltipItem('Cables', detail.cables),
        PortConnectivityDiagramComponent.getTooltipItem('Management IP', detail.managementIp),
        PortConnectivityDiagramComponent.getTooltipItem('Note', detail.note),
        PortConnectivityDiagramComponent.getTooltipItem('Rack', detail.rack),
        PortConnectivityDiagramComponent.getTooltipItem('Room', detail.room),
        PortConnectivityDiagramComponent.getTooltipItem('Speed', detail.speed),
        PortConnectivityDiagramComponent.getTooltipItem('Slot', detail.slot),
        PortConnectivityDiagramComponent.getTooltipItem('WWN', detail.wwn),
        PortConnectivityDiagramComponent.getTooltipItem('Switch', detail.switch),
      ];
      const content = tooltipItems.filter(item => item !== '').join('');
      tooltipContent.innerHTML = '<div style="background-color: #2f2f2f; color: #bfbfbf; border-width:1px;border-style: solid;border-color: #d3d3d3; border-radius: 8px;white-space: nowrap;"><ul style="list-style: none; padding: 2px">' +
        content
        + '</ul></div>';
      if (content === '') {
        tooltipContent = null;
      }
    }
    return tooltipContent;
  }

  public static getTooltipItem(name: string, value: any) {
    if (value !== null) {
      return '<li> <span style="margin: 10px;"> ' + name + ': ' + value + ' </span> </li>';
    }
    return;
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
    let shape = {type: 'Rectangle', radiusCorner: 0} as DiagramShape;
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
      shape: shape.type,
      cornerRadius: shape.radiusCorner
    } as BasicShapeModel;
    node.style.fill = bgColor;
    node.style.strokeColor = strokeColor;
    node.style.strokeWidth = 2;
    const tooltipContent = PortConnectivityDiagramComponent.getContent(node);
    if (tooltipContent !== null) {
      node.tooltip = {content: tooltipContent, relativeMode: 'Mouse', position: 'BottomRight'};
      node.constraints = NodeConstraints.Default | NodeConstraints.Tooltip;
    }

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
    result.push({id: data.id, parentId: data.parentId, name: data.name, type: data.type, detail: data.detail});
    if (data.children.length > 0) {
      data.children.forEach(owner => {
        const ownerData = this.transform(owner);
        result.push(...ownerData);
      });
    }
    return result;
  }
}
