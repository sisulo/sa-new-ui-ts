import {Pipe, PipeTransform} from '@angular/core';
import {Metric} from './models/metrics/metric.vo';

interface ConvertedValue {
  value: number;
  countedOrder: number;
}

@Pipe({
  name: 'storageConvert'
})
export class StorageConvertPipe implements PipeTransform {
  public static unitOrder = {
    'CAPACITY': ['MB', 'GB', 'TB', 'PB'],
    'TRANSFER': ['MBps', 'GBps', 'TBps'],
    'LOGICAL_CAPACITY': ['MB', 'GB', 'TB'],
    'LOGICAL_CHANGE_MONTH': ['MB', 'GB', 'TB'],
    'SUBSCRIBED_CAPACITY': ['MB', 'GB', 'TB'],
    'CHANGE_MONTH': ['MB', 'GB', 'TB', 'PB'],
  };

  transform(metric: Metric, args?: any): any {
    if (StorageConvertPipe.unitOrder[metric.type] === undefined) {
      return metric;
    }
    const startingValue = StorageConvertPipe.unitOrder[metric.type].findIndex(unit => unit === metric.unit);
    let convertedValue = null;
    if (args !== undefined && args.targetedUnitIndex !== undefined) {
      convertedValue = this.convertToMaximumUnit(metric.value, startingValue, args.targetedUnitIndex);
    } else {
      convertedValue = this.convertValue(metric.value, startingValue, StorageConvertPipe.unitOrder[metric.type].length - 1);
    }
    const result = new Metric();
    result.value = convertedValue.value;
    result.type = metric.type;
    result.unit = StorageConvertPipe.unitOrder[metric.type][convertedValue.countedOrder];
    return result;
  }

  convertValue(value: number, startingOrder: number, maximumOrder: number): ConvertedValue {
    let countedOrder = startingOrder;
    let countedValue = value;
    while ((Math.abs(countedValue) / 1024) > 1 && countedOrder < maximumOrder) {
      countedValue = (countedValue / 1024);
      countedOrder++;
    }

    return {value: countedValue, countedOrder: countedOrder} as ConvertedValue;

  }

  convertToMaximumUnit(value: number, startingOrder: number, maximumOrder: number): ConvertedValue {
    let countedOrder = startingOrder;
    let countedValue = value;
    while (countedOrder < maximumOrder) {
      countedValue = (countedValue / 1024);
      countedOrder++;
    }

    return {value: countedValue, countedOrder: countedOrder} as ConvertedValue;
  }
}
