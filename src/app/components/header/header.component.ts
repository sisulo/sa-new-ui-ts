import { Component, OnInit } from '@angular/core';
import {PeriodType} from '../../metric.service';
import {PeriodService} from '../../period.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('openClose', [
      state('true', style({
        // display: 'block'
        transform: 'translateY(0)'
      })),
      state('false', style({
        // display: 'none',
        transform: 'translateY(-100%)'
      })),
      transition('true => *', [
        animate('0.3s')
      ]),
      transition('false => *', [
        animate('0.3s')
      ])
    ]),
  ],
})
export class HeaderComponent implements OnInit {

  enable = false;
  logoUrl = environment.logoUrl;

  public currentPeriod: PeriodType = PeriodType.DAY;

  constructor(private periodService: PeriodService) { }

  ngOnInit() {
    this.periodService.periodEnableAnnouncement.subscribe(
      value => this.enable = value
    );
  }

  setCurrentPeriod(period: PeriodType) {
    this.currentPeriod = period;
    this.periodService.announcePeriod(period);
  }

  isCurrentPeriod(period: PeriodType) {
    return period === this.currentPeriod;
  }

  onAnimationEvent ( event: AnimationEvent ) {
    this.periodService.announcePeriod(this.currentPeriod);
  }

}
