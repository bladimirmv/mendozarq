import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ObservacionServicio } from '@models/mendozarq/observacion.servicio.interface';
import { environment } from '@env/environment.prod';
import { ServicioProyecto } from '@app/shared/models/mendozarq/servicio.proyecto.interface';

export interface obsrServicio {
  servicio?: ServicioProyecto,
  observaciones?: ObservacionServicio[]
};

@Injectable({
  providedIn: 'root'
})
export class ObservacionServicioService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {

  }

  // ====================> addObservacionServicio
  public addObservacionServicio(observacionServicio: ObservacionServicio): Observable<any> {
    console.log('service: ', observacionServicio);

    return this.http
      .post<ObservacionServicio>(`${this.API_URL}/api/observacionServicio`, observacionServicio)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOneObservacionServicio
  public getOneObservacionServicio(uuid: string): Observable<ObservacionServicio> {
    return this.http
      .get<ObservacionServicio>(`${this.API_URL}/api/observacionServicio/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllObservacionServicio
  public getAllObservacionServicio(uuid: string): Observable<obsrServicio[]> {
    return this.http
      .get<obsrServicio[]>(`${this.API_URL}/api/observacionServicio/visita/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updateObservacionServicio
  public updateObservacionServicio(uuid: string, observacionServicio: ObservacionServicio): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/observacionServicio/${uuid}`, observacionServicio)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteObservacionServicio
  public deleteObservacionServicio(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/observacionServicio/${uuid}`)
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
