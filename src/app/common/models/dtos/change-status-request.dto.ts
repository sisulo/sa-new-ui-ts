import {ComponentStatus} from './enums/component.status';


export class ChangeStatusRequestDto {
  readonly status: string;
  constructor(status: string) {
    this.status = status;
  }
}
