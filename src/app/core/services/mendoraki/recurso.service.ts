import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Recurso } from '@app/shared/models/mendoraki/recurso.interface';
import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RecursoService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  // ====================> addRecurso
  public addRecurso(recurso: Recurso): Observable<Recurso> {
    return this.http
      .post<Recurso>(`${this.API_URL}/api/recurso`, recurso)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> getOneRecurso
  public getOneRecurso(uuid: string): Observable<Recurso> {
    return this.http
      .get<Recurso>(`${this.API_URL}/api/recurso/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> getAllRecurso
  public getAllRecurso(): Observable<Recurso[]> {
    return this.http
      .get<Recurso[]>(`${this.API_URL}/api/recurso`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> updateRecurso
  public updateRecurso(uuid: string, recurso: Recurso): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/recurso/${uuid}`, recurso)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> deleteRecurso
  public deleteRecurso(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/recurso/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
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
            errorMessage =
              'No se ha podido establecer una conexion con la base de datos. 🙁';
            break;
          case 1451:
            errorMessage =
              'No se puede eliminar por que este recurso esta relacionado con un proyecto u otra tabla. 🙁';
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
      enableHtml: true,
    });
    return throwError(httpError);
  }
}
