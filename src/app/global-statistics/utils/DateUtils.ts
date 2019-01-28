import {Pipe, PipeTransform} from '@angular/core';


export class DateUtil {
  static SECONDS_IN_HOUR = 3600;
  static SECONDS_IN_MINUTE = 60;

  static transform(value: number): string {
    // console.log(value);
    const hours = Math.floor(value / this.SECONDS_IN_HOUR);
    const minutes = Math.floor((value - (hours * this.SECONDS_IN_HOUR)) / this.SECONDS_IN_MINUTE);
    // console.log((value - (hours * this.SECONDS_IN_HOUR)) / this.SECONDS_IN_MINUTE);
    const seconds = value - (hours * this.SECONDS_IN_HOUR) - (minutes * this.SECONDS_IN_MINUTE);
    return hours.toFixed(0).padStart(2, '0') +
      ':' +  minutes.toFixed(0).padStart(2, '0') +
      ':' + seconds.toFixed(0).padStart(2, '0');
  }
}
