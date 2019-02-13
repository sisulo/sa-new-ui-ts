import {environment} from '../../../environments/environment';

export class UrlCreator {

  static hrefEncode(url: string): string {
    return '/iframe/' + btoa(url);
  }

  static url(systemId: number, linkPart: string) {
    const systemPrefix = systemId.toString().length === 1 ? '0' + systemId : systemId;
    return this.hrefEncode(environment.iframeBaseUrl + systemPrefix + linkPart);
  }
}
