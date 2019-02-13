import { Pipe, PipeTransform } from '@angular/core';
import {UrlCreator} from './UrlCreator';
import {environment} from '../../../environments/environment';

@Pipe({
  name: 'iframeUrlCreator'
})
export class IframeUrlCreatorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return UrlCreator.url(value, environment.iFrameDefaultPage);
  }

}
