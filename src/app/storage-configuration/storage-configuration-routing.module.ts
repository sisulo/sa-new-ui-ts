import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StorageLocationComponent} from './storage-location/storage-location.component';

const routes: Routes = [
  {
    path: 'locations',
    component: StorageLocationComponent,
    data: {
      breadcrumb: 'Locations'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageConfigurationRoutingModule {
}
