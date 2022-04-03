import { DetalleCapitulo } from '@shared/models/mendozarq/presupuestos.interface';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DetalleCapituloService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  // ====================>
  public addDetalleCapitulo(detalleCapitulo: DetalleCapitulo): Observable<any> {
    return this.http
      .post<DetalleCapitulo>(
        `${this.API_URL}/api/detalleCapitulo`,
        detalleCapitulo
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================>
  public getOneDetalleCapitulo(uuid: string): Observable<DetalleCapitulo> {
    return this.http
      .get<DetalleCapitulo>(`${this.API_URL}/api/detalleCapitulo/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }
  public getAllDetalleCapitulo(): Observable<DetalleCapitulo[]> {
    return this.http
      .get<DetalleCapitulo[]>(`${this.API_URL}/api/detalleCapitulo`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  public getAllDetalleCapituloByProyecto(
    uuid: string
  ): Observable<DetalleCapitulo[]> {
    return this.http
      .get<DetalleCapitulo[]>(
        `${this.API_URL}/api/detalleCapitulo/proyecto/${uuid}`
      )
      .pipe(catchError((error) => this.handdleError(error)));
  }
  // ====================>
  public updateDetalleCapitulo(
    uuid: string,
    detalleCapitulo: DetalleCapitulo
  ): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/detalleCapitulo/${uuid}`, detalleCapitulo)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================>
  public deleteDetalleCapitulo(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/detalleCapitulo/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================>
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
              'No se puede eliminar por que este detalle esta relacionado con un capitulo u otra tabla. 🙁';
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
      enableHtml: true,
    });
    return throwError(httpError);
  }
}
