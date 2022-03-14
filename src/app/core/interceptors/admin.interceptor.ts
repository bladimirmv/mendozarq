import { AuthService } from '@app/core/services/auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '@app/shared/models/usuario.interface';
@Injectable()
export class AdminInterceptor implements HttpInterceptor {
  constructor(private authSvc: AuthService, private toastrSvc: ToastrService) {
    this.authSvc.checkToken();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // const url: Array<string> = [
    //   '/api/usuario',
    //   '/api/usuario/',
    //   '/api/personal',
    //   '/api/personal/',
    //   '/api/proyecto',
    //   '/api/proyecto/',
    //   '/api/documentos',
    //   '/api/documentos/',
    //   '/api/participantes',
    //   '/api/participantes/',
    //   '/api/servicioProyecto',
    //   '/api/servicioProyecto/',
    //   '/api/visitaProyecto',
    //   '/api/visitaProyecto/',
    //   '/api/observacionServicio',
    //   '/api/observacionServicio/',
    //   '/api/observacionPersonal',
    //   '/api/observacionPersonal/',
    //   '/api/participanteVisita',
    //   '/api/participanteVisita/',
    //   '/api/presupuestos',
    //   '/api/presupuestos/',
    //   '/api/capituloPresupuesto',
    //   '/api/capituloPresupuesto/',

    //   '/api/herramienta',
    //   '/api/herramienta/',
    //   '/api/categoriarecurso',
    //   '/api/categoriarecurso/',
    //   '/api/recurso',
    //   '/api/recurso/'
    // ];

    // if (url.some(path => req.url.includes(path)))

    const authToken = this.authSvc.userTokenValue;
    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // debugger;

    return next.handle(authRequest).pipe(
      catchError((httpError: HttpErrorResponse) => {
        let errorMessage = '';

        if (httpError.error.message) {
          if (typeof httpError.error.message === 'string') {
            switch (httpError.status) {
              case 401:
                this.authSvc.logout();
                this.toastrSvc.warning(
                  'La sesion ha expirado, porfavor inicia sesion nuevamente',
                  'Sesion Expirada!',
                  {
                    timeOut: 7000,
                  }
                );
                break;
            }
          } else if (httpError.error.message.errno) {
            switch (httpError.error.message.errno) {
              case -111:
                errorMessage =
                  'No se ha podido establecer una conexion con la base de datos. 🙁';
                this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
                  timeOut: 7000,
                  enableHtml: true,
                });
                break;
            }
          }
        }
        return throwError(httpError);
      })
    );
  }
}
