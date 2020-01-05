import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable()
export class HttpLoading implements HttpInterceptor {
  private runningCalls = 0;

  constructor(private spinnerService: NgxSpinnerService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    this.runningCalls++;
    this.spinnerService.show();
    return next.handle(req).pipe(
      finalize(
        () => {
          this.runningCalls--;
          if (this.runningCalls === 0) {
            this.spinnerService.hide();
          }
        }
      ),
    );
  }
}
