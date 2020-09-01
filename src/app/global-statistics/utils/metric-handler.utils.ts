import {StorageEntityMetricDto} from '../../common/models/dtos/storage-entity-metric.dto';

export class MetricHandlerUtils {
  public static success(data: StorageEntityMetricDto[]) {
    const d = data.reduce((previousValue, currentValue) => [...previousValue, ...currentValue.children], []);
    console.log(d);
    return d;
  }

  public static error(error) {
    console.log(error);
    return [];
  }
}
