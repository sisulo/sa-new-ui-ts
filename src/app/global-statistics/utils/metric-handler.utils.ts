import {StorageEntityMetricDto} from '../../common/models/dtos/storage-entity-metric.dto';

export class MetricHandlerUtils {
  public static success(data: StorageEntityMetricDto[]) {
    return data.reduce((previousValue, currentValue) => [...previousValue, ...currentValue.children], []);
  }

  public static error(error) {
    console.log(error);
    return [];
  }
}
