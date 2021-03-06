import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CategoriaProyecto } from '@models/mendozarq/categoria.proyecto.interface';
import { environment } from '@env/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProyectoService {

  private API_URL = environment.API_URL;


  constructor(private http: HttpClient, private toastrSvc: ToastrService) {
  }

  // ====================> addCategoriaProyecto
  public addCategoriaProyecto(categoriaProyecto: CategoriaProyecto): Observable<CategoriaProyecto> {
    return this.http
      .post<CategoriaProyecto>(`${this.API_URL}/api/categoriaProyecto`, categoriaProyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getOneCategoriaProyecto
  public getOneCategoriaProyecto(uuid: string): Observable<CategoriaProyecto> {
    return this.http
      .get<CategoriaProyecto>(`${this.API_URL}/api/categoriaProyecto/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> getAllCategoriaProyecto
  public getAllCategoriaProyecto(): Observable<CategoriaProyecto[]> {
    return this.http
      .get<CategoriaProyecto[]>(`${this.API_URL}/api/categoriaProyecto`)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> updateCategoriaProyecto
  public updateCategoriaProyecto(uuid: string, categoriaProyecto: CategoriaProyecto): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/categoriaProyecto/${uuid}`, categoriaProyecto)
      .pipe(catchError(error => this.handdleError(error)));
  }

  // ====================> deleteCategoriaProyecto
  public deleteCategoriaProyecto(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/categoriaProyecto/${uuid}`)
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
            errorMessage = 'No se puede eliminar por que esta categoria esta relacionado con una tabla externa. 🙁';
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
