import {Component, Input, OnInit} from '@angular/core';
import {Occurence} from '../../models/metrics/Occurence';
import {ActivatedRoute, Router} from '@angular/router';
import {EntityType} from '../../models/metrics/EntityType';
import {MetricService} from '../../../metric.service';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {

  @Input() value: number;
  @Input() label: string;
  @Input() context: string;
  @Input() threshold = 0;
  @Input() icon = '';
  @Input() data: Occurence[] = [];

  entityType = EntityType;
  modalState = 'close';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metric: MetricService
  ) {
  }

  ngOnInit() {
    if (this.data.length > 0) {

      const result = this.data.sort(
        (occurence1, occurrence2) => {
          return occurrence2.value - occurence1.value;
        }
      );
      console.log(this.data);
    }
  }

  isOverThreshold() {
    return this.value > this.threshold;
  }

  openModal() {
    this.modalState = 'open';
  }

  closeModal() {
    this.modalState = 'close';
  }

  isModalOpened() {
    return this.modalState === 'open';
  }
}
