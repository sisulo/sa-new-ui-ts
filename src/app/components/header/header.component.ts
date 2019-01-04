import { Component, OnInit } from '@angular/core';
import {PeriodType} from '../../metric.service';
import {PeriodService} from '../../period.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentPeriod: PeriodType = PeriodType.DAY;

  constructor(private periodService: PeriodService) { }

  ngOnInit() {
  }

  setCurrentPeriod(period: PeriodType) {
    this.currentPeriod = period;
    this.periodService.announcePeriod(period);
  }

  isCurrentPeriod(period: PeriodType) {
    return period === this.currentPeriod;
  }
}
