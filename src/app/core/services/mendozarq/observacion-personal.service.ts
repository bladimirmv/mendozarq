import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ObservacionesByPersonal, ObservacionPersonal } from '@models/mendozarq/observacion.personal.interface';
import { environment } from '@env/environment.prod';
import { ServicioProyecto } from '@app/shared/models/mendozarq/servicio.proyecto.interface';

@Injectable({
  providedIn: 'root'
})
export class ObservacionPersonalService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {

  }

  // ====================> addObservacionPersonal
  public addObservacionPersonal(observacionPersonal: ObservacionPersonal): Observable<any> {
    return this.http
      .post<ObservacionPersonal>(`${this.API_URL}/api/observacionPersonal`, observacionPersonal)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOneObservacionPersonal
  public getOneObservacionPersonal(uuid: string): Observable<ObservacionPersonal> {
    return this.http
      .get<ObservacionPersonal>(`${this.API_URL}/api/observacionPersonal/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllObservacionPersonal
  public getAllObservacionPersonal(uuid: string): Observable<ObservacionesByPersonal[]> {
    return this.http
      .get<ObservacionesByPersonal[]>(`${this.API_URL}/api/observacionPersonal/visita/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllPersonalByUuidVisita
  public getAllPersonalByUuidVisita(uuid: string): Observable<ServicioProyecto[]> {
    return this.http
      .get<ServicioProyecto[]>(`${this.API_URL}/api/observacionPersonal/personal/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updateObservacionPersonal
  public updateObservacionPersonal(uuid: string, observacionPersonal: ObservacionPersonal): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/observacionPersonal/${uuid}`, observacionPersonal)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteObservacionPersonal
  public deleteObservacionPersonal(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/observacionPersonal/${uuid}`)
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
            errorMessage = 'No se puede eliminar por que esta observacion esta relacionado con una proyecto u otra tabla. 🙁';
            break;
          default:
            errorMessage = `
            Error: ${httpError.statusText} </br>
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
