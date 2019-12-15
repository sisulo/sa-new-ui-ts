import {Component, Input, OnInit} from '@angular/core';
import {Occurence} from '../../models/metrics/Occurence';
import {ActivatedRoute, Router} from '@angular/router';
import {EntityType} from '../../models/metrics/EntityType';
import {MetricService} from '../../../metric.service';
import {Alert} from '../../models/metrics/Alert';
import {AlertType} from '../../models/metrics/AlertType';

@Component({
  selector: 'app-alert-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class AlertInfoBoxComponent implements OnInit {

  value: number;
  @Input() label: string;
  @Input() context: string;
  minValue = 0;
  maxValue = 0;
  @Input() threshold = 0;
  @Input() icon = '';
  data: Occurence[] = [];
  @Input() alert: Alert;
  @Input() infoBoxTooltip: string;

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
    }
    this.value = this.alert.occurrences.length;
    this.data = this.alert.occurrences;
    this.minValue = this.alert.minValue;
    this.maxValue = this.alert.maxValue;
    this.infoBoxTooltip = this.getThresholdMessage(this.alert.type, this.alert.minValue, this.alert.maxValue, this.alert.unit);
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

  getIframeLink(entityType: EntityType) {
    switch (entityType) {
      case EntityType.ADAPTER:
        return 'adapters';
      case EntityType.POOL:
        return 'capacityAnalysis';
      case EntityType.SYSTEM:
        return 'dashboard';

    }
  }

  getThresholdMessage(type: AlertType, minValue: number, maxValue: number, unit: string) {
    if (maxValue == null && minValue == null) {
      return 'Everything works right!';
    }
    let sanitizeUnit = unit;
    if (sanitizeUnit == null) {
      sanitizeUnit = '';
    }
    if (maxValue == null) {
      return `${this.label} over ${minValue}${sanitizeUnit}`;
    }
    if (minValue == null) {
      return `${this.label} under ${maxValue}${sanitizeUnit}`;
    }
    return `${this.label} between ${minValue}${sanitizeUnit} and ${maxValue}${sanitizeUnit}`;
  }

  getContext(entityType: EntityType) {
    switch (entityType) {
      case EntityType.ADAPTER:
      case EntityType.PORT:
        return 'adapters';
      case EntityType.POOL:
        return 'capacityAnalysis';
      case EntityType.SYSTEM:
        return 'dashboard';

    }
  }

}
