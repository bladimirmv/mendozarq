import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from '@env/environment';
import { CategoriaRecurso } from '@models/mendozarq/categoria.recurso.interface';
@Injectable({
  providedIn: 'root'
})
export class CategoriaRecursoService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient, private toastrSvc: ToastrService) { }
  // ====================================================================
  public addCategoriaRecurso(categoriaRecurso: CategoriaRecurso): Observable<CategoriaRecurso> {
    return this.http
      .post<CategoriaRecurso>(`${this.API_URL}/api/categoriarecurso`, categoriaRecurso)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public updateCategoriaRecurso(uuid: string, categoriaRecurso: CategoriaRecurso): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/categoriarecurso/${uuid}`, categoriaRecurso)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getAllCategoriasRecurso(): Observable<CategoriaRecurso[]> {
    return this.http
      .get<CategoriaRecurso[]>(`${this.API_URL}/api/categoriarecurso`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getOneCategoriaRecurso(uuid: string): Observable<CategoriaRecurso> {
    return this.http
      .get<CategoriaRecurso>(`${this.API_URL}/api/categoriarecurso/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public deleteCategoriaRecurso(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/categoriarecurso/${uuid}`)
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
