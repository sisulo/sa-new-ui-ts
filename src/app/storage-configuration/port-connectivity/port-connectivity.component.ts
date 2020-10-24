import {Component, OnInit} from '@angular/core';
import {MetricService} from '../../metric.service';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';

@Component({
  selector: 'app-port-connectivity',
  templateUrl: './port-connectivity.component.html',
  styleUrls: ['./port-connectivity.component.css']
})
export class PortConnectivityComponent implements OnInit {

  systemsList: { id, label }[] = [];
  selectedSystem: number;

  constructor(private metricService: MetricService) {
  }

  ngOnInit() {
    this.metricService.getSystemsDetail(StorageEntityType.SYSTEM).subscribe(response => {
      response.forEach(dc => {
        dc.storageEntity.children.forEach(system => this.systemsList.push({id: system.id, label: system.name}));
      });
    });
  }

}
