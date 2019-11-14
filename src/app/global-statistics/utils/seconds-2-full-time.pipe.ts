import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'seconds2FullTime'
})
export class Seconds2FullTimePipe implements PipeTransform {
  static SECONDS_IN_HOUR = 3600;
  static SECONDS_IN_MINUTE = 60;

  public transform(value: number): string {
    const hours = Math.floor(value / Seconds2FullTimePipe.SECONDS_IN_HOUR);
    const minutes = Math.floor((value - (hours * Seconds2FullTimePipe.SECONDS_IN_HOUR)) / Seconds2FullTimePipe.SECONDS_IN_MINUTE);
    const seconds = value - (hours * Seconds2FullTimePipe.SECONDS_IN_HOUR) - (minutes * Seconds2FullTimePipe.SECONDS_IN_MINUTE);
    return hours.toFixed(0).padStart(2, '0') +
      ':' + minutes.toFixed(0).padStart(2, '0') +
      ':' + seconds.toFixed(0).padStart(2, '0');
  }
}
