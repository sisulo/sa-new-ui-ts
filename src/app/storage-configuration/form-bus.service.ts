import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {StorageEntityVo} from './storage-entity-form/storage-entity-form.component';

@Injectable({
  providedIn: 'root'
})
export class FormBusService {
  // Observable string sources
  private storageEntityForm = new Subject<StorageEntityVo>();

  storageEntityFormStream = this.storageEntityForm.asObservable();

  sendFormData(data: StorageEntityVo) {
    this.storageEntityForm.next(data);
  }
  constructor() { }
}
