import {SystemDetail} from '../system-detail.vo';

export class PerformanceStatisticsDto {
  id: string; // TODO should be number
  label: string;
  systems: SystemDetail[];
}
