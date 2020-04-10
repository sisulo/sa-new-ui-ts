import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {MetricService} from '../../metric.service';
import {Datacenter} from '../../common/models/datacenter.vo';


export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})

export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: IBreadCrumb[];
  private dataCenters: Datacenter[];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metricService: MetricService,
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {

      this.metricService.getDatacenters().subscribe(
        dto => {
          console.log(dto);
          this.dataCenters = dto.datacenters;
          this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
        }
      );
    });
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[] {
    let previousBreadCrumb = null;
    let newBreadcrumbs = [];
    const data = route.routeConfig && route.routeConfig.data ? route.routeConfig.data : null;
    let label = data ? data.breadcrumb : '';
    let path = data ? route.routeConfig.path : '';

    const lastRoutePart = path.split('/').pop();
    const isDynamicRoute = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const splittedPart = lastRoutePart.split(':');
      const paramName = splittedPart[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      if (route.snapshot.params[paramName] === '-1') {
        label = 'All';
      } else {
        label = this.getDatacenterName(parseInt(route.snapshot.params[paramName], 10));
      }

      previousBreadCrumb = {
        label: data.breadcrumb,
        url: `${url}/${path.split('/')[0]}`
      };

    }
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
      label: label,
      url: this.resolveUrl(data, nextUrl),
    };
    if (previousBreadCrumb) {
      newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, previousBreadCrumb, breadcrumb] : [...breadcrumbs];
    } else {
      newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    }
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

  private getDatacenterName(idDatacenter: number) {
    const datacenterObj = this.dataCenters.find(datacenter => datacenter.id === idDatacenter);
    if (datacenterObj === undefined) {
      return '';
    }
    return datacenterObj.label;
  }

  resolveUrl(data, nextUrl) {
    if (data !== null && data.url !== undefined) {
      return data.url;
    }
    return nextUrl;
  }
}
