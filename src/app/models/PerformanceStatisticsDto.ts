import {SystemDetail} from './SystemDetail';

export class PerformanceStatisticsDto {
  id: string;
  label: string;
  systems: SystemDetail[];
}
