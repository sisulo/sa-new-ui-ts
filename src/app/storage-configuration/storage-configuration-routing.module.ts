import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StorageLocationComponent} from './storage-location/storage-location.component';
import {PortConnectivityComponent} from './port-connectivity/port-connectivity.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageConfigurationRoutingModule {
}
