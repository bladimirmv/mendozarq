import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PresupuestoObra } from '@models/mendozarq/presupuestos.interface';
import { environment } from '@env/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {
  }

  // ====================> addPresupuestoObra
  public addPresupuestoObra(presupuestoObra: PresupuestoObra): Observable<any> {
    return this.http
      .post<PresupuestoObra>(`${this.API_URL}/api/presupuestos`, presupuestoObra)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOnePresupuestoObra
  public getOnePresupuestoObra(uuid: string): Observable<PresupuestoObra> {
    return this.http
      .get<PresupuestoObra>(`${this.API_URL}/api/presupuestos/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllPresupuestoObra
  public getAllPresupuestoObra(): Observable<PresupuestoObra[]> {
    return this.http
      .get<PresupuestoObra[]>(`${this.API_URL}/api/presupuestos/`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updatePresupuestoObra
  public updatePresupuestoObra(uuid: string, presupuestoObra: PresupuestoObra): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/presupuestos/${uuid}`, presupuestoObra)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deletePresupuestoObra
  public deletePresupuestoObra(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/presupuestos/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> handdleError
  public handdleError(httpError: HttpErrorResponse | any): Observable<never> {
    let errorMessage = '';
    if (httpError.error.message) {
      if (typeof httpError.error.message === 'string') {
        errorMessage = `${httpError.error.message}`;
      } else if (httpError.error.message.errno) {
        switch (httpError.error.message.errno) {
          case -111:
            errorMessage = 'No se ha podido establecer una conexion con la base de datos. 🙁';
            break;
          case 1451:
            errorMessage = 'No se puede eliminar por que este presupuesto esta relacionado con un capitulo u otra tabla. 🙁';
            break;
          default:
            errorMessage = `
            Error: ${httpError.statusText}</br>
            Status: ${httpError.status}`;
            break;
        }
      }
    }
    console.log('this error', httpError);
    this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
      timeOut: 7000,
      enableHtml: true
    });
    return throwError(httpError);
  }
}
