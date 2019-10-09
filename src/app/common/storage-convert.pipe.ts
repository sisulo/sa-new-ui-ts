import {Pipe, PipeTransform} from '@angular/core';
import {Metric} from './models/metrics/Metric';

interface ConvertedValue {
  value: number;
  countedOrder: number;
}

@Pipe({
  name: 'storageConvert'
})
export class StorageConvertPipe implements PipeTransform {
  unitOrder = {'CAPACITY': ['MB', 'GB', 'TB', 'PB'], 'TRANSFER': ['MBps', 'GBps', 'TBps']};

  transform(metric: Metric, args?: any): any {
    console.log(this.unitOrder[metric.type]);
    if (this.unitOrder[metric.type] === undefined) {
      return metric;
    }
    const startingValue = this.unitOrder[metric.type].findIndex(unit => unit === metric.unit);
    const convertedValue = this.convertValue(metric.value.toFixed(0), startingValue);
    const result = new Metric();
    result.value = convertedValue.value;
    result.type = metric.type;
    result.unit = this.unitOrder[metric.type][convertedValue.countedOrder];
    return result;
  }

  convertValue(value: string, startingOrder: number): ConvertedValue {
    let countedOrder = startingOrder;
    let countedValue = value;
    while ((Number.parseInt(countedValue, 10) / 1024) > 1) {
      countedValue = (Number.parseInt(countedValue, 10) / 1024).toFixed(0);
      countedOrder++;
    }

    return {value: Number.parseInt(countedValue, 10), countedOrder: countedOrder} as ConvertedValue;

  }
}
