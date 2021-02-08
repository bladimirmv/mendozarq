import { AuthService } from '@app/core/services/auth/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
@Injectable()
export class AdminInterceptor implements HttpInterceptor {

  constructor(private authSvc: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    const url: Array<string> = [
      '/api/usuario',
      '/api/usuario/',
      '/api/personal',
      '/api/personal/',
      '/api/proyecto',
      '/api/proyecto/',
      '/api/documentos',
      '/api/documentos/',

      '/api/herramienta',
      '/api/herramienta/',

      '/api/categoriarecurso',
      '/api/categoriarecurso/',
      '/api/recurso',
      '/api/recurso/'
    ];

    if (url.some(path => req.url.includes(path))) {
      const authToken = this.authSvc.userTokenValue;
      const authRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      // debugger;

      return next.handle(authRequest);
    }

    return next.handle(req);

  }
}
