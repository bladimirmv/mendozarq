import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from '@env/environment';
import { Usuario, Roles } from '@models/usuario.interface';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient, private toastrSvc: ToastrService) { }
  // ====================================================================
  public addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${this.API_URL}/api/usuario`, usuario)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public updateUsuario(uuid: string, usuario: Usuario): Observable<any> {
    return this.http
      .put(`${this.API_URL}/api/usuario/${uuid}`, usuario)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getAllUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.API_URL}/api/usuario`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public getOneUsuario(uuid: string): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.API_URL}/api/usuario/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public deleteUsuario(uuid: string): Observable<any> {
    return this.http
      .delete(`${this.API_URL}/api/usuario/${uuid}`)
      .pipe(catchError(error => this.handdleError(error)));
  }
  // ====================================================================
  public handdleError(httpError: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (httpError) {
      if (typeof httpError.error.message === 'string') {
        errorMessage = `${httpError.error.message}`;
      } else {
        switch (httpError.error.message.errno) {
          case -111:
            errorMessage = 'No se ha podido establecer una conexion con el servidor. 🙁';
            break;
          case 1451:
            errorMessage = 'No se puede eliminar por que este usuario esta relacionado con un proyecto u otra tabla. 🙁';
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
  // ====================================================================
}
