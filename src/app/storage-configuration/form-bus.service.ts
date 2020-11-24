import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {StorageEntityVo} from './storage-entity-form/storage-entity-form.component';
import {Owner} from '../common/models/dtos/owner.dto';
interface FormStorageEntity {
  data: StorageEntityVo;
  selectedData: Owner[];
}
@Injectable({
  providedIn: 'root'
})
export class FormBusService {

  private storageEntityForm = new Subject<FormStorageEntity>();

  storageEntityFormStream$ = this.storageEntityForm.asObservable();

  sendFormData(data: FormStorageEntity) {
    this.storageEntityForm.next(data);
  }

  constructor() {
  }
}
