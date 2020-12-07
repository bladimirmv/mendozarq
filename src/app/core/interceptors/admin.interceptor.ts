import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
@Injectable()
export class AdminInterceptor implements HttpInterceptor {

  constructor(private authSvc: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    const url: Array<string> = [
      // '/api/usuario',
    ];

    if (url.some(path => req.url.includes(path))) {
      const authToken = this.authSvc.userTokenValue;
      const authRequest = req.clone({
        setHeaders: {
          Authorization: authToken,
        }
      });
      return next.handle(authRequest);
    }

    return next.handle(req);

  }
}
