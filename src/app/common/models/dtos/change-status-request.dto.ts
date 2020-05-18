import {ComponentStatus} from './enums/component.status';


export class ChangeStatusRequestDto {
  readonly status: ComponentStatus;
}
