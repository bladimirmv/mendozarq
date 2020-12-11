import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from '@env/environment';
import { Recurso } from '@models/mendozarq/recurso.interface';
@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient, private toastrSvc: ToastrService) { }
  // ====================================================================
  public addRecurso(Recurso: Recurso): Observable<Recurso> {
    return this.http
      .post<Recurso>(`${this.API_URL}/api/recurso`, Recurso)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public updateRecurso(uuid: string, Recurso: Recurso): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/recurso/${uuid}`, Recurso)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getAllRecursos(): Observable<Recurso[]> {
    return this.http
      .get<Recurso[]>(`${this.API_URL}/api/recurso`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getOneRecurso(uuid: string): Observable<Recurso> {
    return this.http
      .get<Recurso>(`${this.API_URL}/api/recurso/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public deleteRecurso(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/recurso/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public handdleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error) {
      error.error.message ? errorMessage = `Error: ${error.error.message}</br>`
        : errorMessage = `
        Error: ${error.statusText} </br>
        Status: ${error.status}`;
    }
    // console.log('this error', error);

    this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
      timeOut: 7000,
      enableHtml: true
    });

    return throwError(errorMessage);
  }
  // ====================================================================
}
