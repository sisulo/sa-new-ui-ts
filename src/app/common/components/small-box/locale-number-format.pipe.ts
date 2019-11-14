import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'localeNumberFormat'
})
export class LocaleNumberFormatPipe implements PipeTransform {

  public static DECIMAL_SIZE = 3;

  transform(value: number): any {
    const result = [];
    let partValue = value.toFixed(0);
    while (this.lastNChar(partValue, LocaleNumberFormatPipe.DECIMAL_SIZE) !== '') {
      result.push(this.lastNChar(partValue, LocaleNumberFormatPipe.DECIMAL_SIZE));
      partValue = this.ignoreLastNChar(partValue, LocaleNumberFormatPipe.DECIMAL_SIZE);
    }
    return result.reverse().join(' ');
  }

  lastNChar(value, count) {
    return value.substring(value.length - count, value.length);
  }

  ignoreLastNChar(value, count) {
    return value.substring(0, value.length - count);
  }
}
