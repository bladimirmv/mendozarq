import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Proyecto } from '@models/mendozarq/proyecto.interface';
import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private API_URL = environment.API_URL;


  constructor(private http: HttpClient, private toastrSvc: ToastrService) {
  }

  // ====================> addProyecto
  public addProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http
      .post<Proyecto>(`${this.API_URL}/api/proyecto`, proyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOneProyecto
  public getOneProyecto(uuid: string): Observable<Proyecto> {
    return this.http
      .get<Proyecto>(`${this.API_URL}/api/proyecto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllProyecto
  public getAllProyecto(): Observable<Proyecto[]> {
    return this.http
      .get<Proyecto[]>(`${this.API_URL}/api/proyecto`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updateProyecto
  public updateProyecto(uuid: string, proyecto: Proyecto): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/proyecto/${uuid}`, proyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteProyecto
  public deleteProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/proyecto/${uuid}`)
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
            errorMessage = 'No se puede eliminar por que este proyecto esta relacionado con una o varias tablas. 🙁';
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
