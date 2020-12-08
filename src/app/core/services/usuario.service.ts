import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
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
  public handdleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrio un error al recuperar los datos';
    if (error) {
      errorMessage = `Error: ${error.message}`;
    }
    this.toastrSvc.error(errorMessage, 'Ocurrio un Error!', {
      timeOut: 5000
    });
    return throwError(errorMessage);
  }
  // ====================================================================
}
