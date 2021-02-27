import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Personal } from '@models/mendozarq/personal.interface';
import { environment } from '@env/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  private API_URL = environment.API_URL;


  constructor(private http: HttpClient, private toastrSvc: ToastrService) {

  }

  // ====================> addPersonal
  public addPersonal(personal: Personal): Observable<Personal> {
    return this.http
      .post<Personal>(`${this.API_URL}/api/personal`, personal)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOnePersonal
  public getOnePersonal(uuid: string): Observable<Personal> {
    return this.http
      .get<Personal>(`${this.API_URL}/api/personal/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllPersonal
  public getAllPersonal(): Observable<Personal[]> {
    return this.http
      .get<Personal[]>(`${this.API_URL}/api/personal`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updatePersonal
  public updatePersonal(uuid: string, personal: Personal): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/personal/${uuid}`, personal)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deletePersonal
  public deletePersonal(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/personal/${uuid}`)
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
            errorMessage = 'No se puede eliminar por que este personal esta relacionado con un proyecto u otra tabla. 🙁';
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
