import {Pipe, PipeTransform} from '@angular/core';
import {UrlCreator} from './url-creatot.utils';

@Pipe({
  name: 'iframeUrlCreator'
})
export class IframeUrlCreatorPipe implements PipeTransform {

  iFrameLinks = {
    dashboard: '1%20Dash%20Board/index.html',
    serverBoard: '2%20Server%20Board/index.html',
    dpSla: '4%20DP%20Pool%20Board%20and%20SLA/index.html',
    deepAnalysis: '7%20Deep%20Analysis/index.html',
    cache: '8%20Cache%20Board/index.html',
    adapters: '8%20CHA%20Adapters%20Board/index.html',
    trends: '8%20Trends/index.html',
    capacityAnalysis: '9%20Capacity%20Analysis/index.html',
    hostGroups: '9%20Capacity%20Analysis/VM%20Capacity%20Analysis.html',
  };
  mapSystemToDirectory = [];

  constructor() {
    this.mapSystemToDirectory[1] = '01';
    this.mapSystemToDirectory[2] = '02';
    this.mapSystemToDirectory[3] = '03';
    this.mapSystemToDirectory[4] = '04';
    this.mapSystemToDirectory[5] = '05';
    this.mapSystemToDirectory[6] = '06';
    // this.mapToDirectory[7] = '';
    this.mapSystemToDirectory[8] = '22';
    this.mapSystemToDirectory[9] = '23';
    this.mapSystemToDirectory[10] = '24';
    this.mapSystemToDirectory[11] = '25';
    this.mapSystemToDirectory[12] = '26';
    // this.mapToDirectory[13] = '';
    this.mapSystemToDirectory[14] = '62';
    this.mapSystemToDirectory[15] = '41';
    this.mapSystemToDirectory[16] = '42';
    this.mapSystemToDirectory[17] = '43';
    this.mapSystemToDirectory[18] = '44';
    this.mapSystemToDirectory[19] = '81';
    this.mapSystemToDirectory[20] = '51';
    this.mapSystemToDirectory[21] = '52';
    // this.mapSystemToDirectory[22] = '71';
    this.mapSystemToDirectory[23] = '72';
    this.mapSystemToDirectory[24] = '27';
    this.mapSystemToDirectory[25] = '63';
  }

  transform(value: any, args: any): any {
    let anchorParam = '';
    if (args.anchor != null) {
      anchorParam = `#${this.normalizeAnchor(args.anchor)}`;
    }
    return UrlCreator.url(this.mapToDirectory(value), this.iFrameLinks[args.iframeLink] + anchorParam);
  }

  mapToDirectory(id: number) {
    if (this.mapSystemToDirectory[id] !== undefined) {
      return this.mapSystemToDirectory[id];
    }
    throw new Error(`ID: ${id} not found in mapping`);
  }

  normalizeAnchor(value) {
    if (value != null) {
      return value.replace(/[#\-\s\,]+/g, '_');
    }
    return '';
  }
}
