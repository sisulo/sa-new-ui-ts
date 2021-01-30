import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StorageLocationComponent} from './storage-location/storage-location.component';
import {PortConnectivityComponent} from './port-connectivity/port-connectivity.component';
import {PortConnectivityDiagramComponent} from './port-connectivity-diagram/port-connectivity-diagram.component';

const routes: Routes = [
  {
    path: 'locations',
    component: StorageLocationComponent,
    data: {
      breadcrumb: 'Locations'
    }
  },
  {
    path: 'port-connectivity',
    component: PortConnectivityComponent,
    data: {
      breadcrumb: 'Port Connectivity'
    }
  },
  {
    path: 'port-connectivity-diagram/:id',
    component: PortConnectivityDiagramComponent,
    data: {
      breadcrumb: 'Port Connectivity Diagram'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageConfigurationRoutingModule {
}
