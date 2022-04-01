import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Proveedor } from '@app/shared/models/mendoraki/proveedor.interface';
import { environment } from '@env/environment.prod';
@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private toastrSvc: ToastrService) {}

  // ====================> addProveedor
  public addProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http
      .post<Proveedor>(`${this.API_URL}/api/proveedor`, proveedor)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> getOneProveedor
  public getOneProveedor(uuid: string): Observable<Proveedor> {
    return this.http
      .get<Proveedor>(`${this.API_URL}/api/proveedor/${uuid}`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> getAllProveedor
  public getAllProveedor(): Observable<Proveedor[]> {
    return this.http
      .get<Proveedor[]>(`${this.API_URL}/api/proveedor`)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> updateProveedor
  public updateProveedor(uuid: string, proveedor: Proveedor): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/proveedor/${uuid}`, proveedor)
      .pipe(catchError((error) => this.handdleError(error)));
  }

  // ====================> deleteProveedor
  public deleteProveedor(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/proveedor/${uuid}`)
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
              'No se puede eliminar por que este proveedor esta relacionado con un proyecto u otra tabla. 🙁';
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
