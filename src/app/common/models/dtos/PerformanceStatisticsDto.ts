import {SystemDetail} from '../SystemDetail';

export class PerformanceStatisticsDto {
  id: string; // TODO should be number
  label: string;
  systems: SystemDetail[];
}
