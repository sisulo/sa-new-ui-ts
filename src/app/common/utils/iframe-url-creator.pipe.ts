import { Pipe, PipeTransform } from '@angular/core';
import {UrlCreator} from './UrlCreator';
import {environment} from '../../../environments/environment';

@Pipe({
  name: 'iframeUrlCreator'
})
export class IframeUrlCreatorPipe implements PipeTransform {

  iFrameLinks = {
    dashboard: '1%20Dash%20Board/Dash%20Board.html',
    serverBoard: '2%20Server%20Board/index.html',
    dpSla: '4%20DP%20Pool%20Board%20and%20SLA/index.html',
    deepAnalysis: '7%20Deep%20Analysis/index.html',
    cache:  '8%20Cache%20Board/index.html',
    adapters: '8%20CHA%20Adapters%20Board/index.html',
    trends: '8%20Trends/Trends.html'
  };

  transform(value: any, linkType: string): any {
    return UrlCreator.url(value, this.iFrameLinks[linkType]);
  }

}
