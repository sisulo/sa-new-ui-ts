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
  unitOrder = {
    'CAPACITY': ['MB', 'GB', 'TB', 'PB'],
    'TRANSFER': ['MBps', 'GBps', 'TBps'],
    'LOGICAL_CAPACITY': ['MB', 'GB', 'TB'],
    'LOGICAL_CHANGE_MONTH': ['MB', 'GB', 'TB', 'PB'],
    'SUBSCRIBED_CAPACITY': ['MB', 'GB', 'TB'],
    'CHANGE_MONTH': ['MB', 'GB', 'TB', 'PB'],
  };

  transform(metric: Metric, args?: any): any {
    if (this.unitOrder[metric.type] === undefined) {
      return metric;
    }
    const startingValue = this.unitOrder[metric.type].findIndex(unit => unit === metric.unit);
    const convertedValue = this.convertValue(metric.value.toFixed(0), startingValue, this.unitOrder[metric.type].length - 1);
    const result = new Metric();
    result.value = convertedValue.value;
    result.type = metric.type;
    result.unit = this.unitOrder[metric.type][convertedValue.countedOrder];
    return result;
  }

  convertValue(value: string, startingOrder: number, maximumOrder: number): ConvertedValue {
    let countedOrder = startingOrder;
    let countedValue = value;
    while ((Number.parseInt(countedValue, 10) / 1024) > 1 && countedOrder < maximumOrder) {
      countedValue = (Number.parseInt(countedValue, 10) / 1024).toFixed(0);
      countedOrder++;
    }

    return {value: Number.parseInt(countedValue, 10), countedOrder: countedOrder} as ConvertedValue;

  }
}
