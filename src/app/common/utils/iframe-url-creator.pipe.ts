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
    this.mapSystemToDirectory['XP7_G11_58417'] = '01';
    this.mapSystemToDirectory['XP7_G12_58416'] = '02';
    this.mapSystemToDirectory['XP7_G13_58734'] = '03';
    this.mapSystemToDirectory['XP7_G14_10560'] = '04';
    this.mapSystemToDirectory['XP7_G15_20028'] = '05';
    this.mapSystemToDirectory['XP7_G16_20359'] = '06';
    // this.mapToDirectory[7] = '';
    this.mapSystemToDirectory['XP7_B12_58678'] = '22';
    this.mapSystemToDirectory['XP7_B13_59006'] = '23';
    this.mapSystemToDirectory['XP7_B14_10554'] = '24';
    this.mapSystemToDirectory['XP7_B15_10640'] = '25';
    this.mapSystemToDirectory['XP7_B16_11114'] = '26';
    // this.mapToDirectory[13] = '';
    this.mapSystemToDirectory['XP7_STL2_10558'] = '62';
    this.mapSystemToDirectory['XP7_CBJ2_57216'] = '41';
    this.mapSystemToDirectory['XP7_CBJ3_57222'] = '42';
    this.mapSystemToDirectory['XP7_CBJ4_20575'] = '43';
    this.mapSystemToDirectory['XP7_CBJ5_56053'] = '44';
    this.mapSystemToDirectory['XP7_AIMS1_20627'] = '81';
    this.mapSystemToDirectory['XP7_QAS1_20610'] = '51';
    this.mapSystemToDirectory['XP7_QAS2_56139'] = '52';
    // this.mapSystemToDirectory[22] = '71';
    this.mapSystemToDirectory['XP7_MEG2_20725'] = '72';
    this.mapSystemToDirectory['XP7_B17_50225'] = '27';
    this.mapSystemToDirectory['XP7_STL3_58634'] = '63';
    this.mapSystemToDirectory['XP8_G22_30738'] = '12';
    this.mapSystemToDirectory['XP8_G23_30739'] = '13';
    this.mapSystemToDirectory['XP8_G21_30759'] = '32';
    this.mapSystemToDirectory['XP8_B22_30754'] = '11';
  }

  transform(value: any, args: any): any {
    let anchorParam = '';
    if (args.anchor != null) {
      anchorParam = `#${this.normalizeAnchor(args.anchor)}`;
    }
    return UrlCreator.url(this.mapToDirectory(value), this.iFrameLinks[args.iframeLink] + anchorParam);
  }

  mapToDirectory(id: string) {
    if (this.mapSystemToDirectory[id] !== undefined) {
      return this.mapSystemToDirectory[id];
    }
    // throw new Error(`ID: ${id} not found in mapping`);
  }

  normalizeAnchor(value) {
    if (value != null) {
      return value.replace(/[#\-\s,]+/g, '_');
    }
    return '';
  }
}
