import { catchError, map, take } from 'rxjs/operators';
import { UsuarioResponse } from './../../shared/models/usuario.interface';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { RoleValidator } from './../helpers/roleValidator';
import { Injectable } from '@angular/core';

import { Usuario, Roles } from '@app/shared/models/usuario.interface';


import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {

  private loggedIn = new BehaviorSubject<boolean>(false);

  private usuario = new BehaviorSubject<Usuario>(null);

  public usuario$ = this.usuario.asObservable();



  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {
    super();
    // this.socket = io(this.server);
    this.checkToken();
  }

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public login(authData: Usuario): Observable<UsuarioResponse | void> {
    return this.http.post<UsuarioResponse>(`${this.API_URL}/api/auth/login`, authData)
      .pipe(
        map((res: UsuarioResponse) => {
          this.saveToken(res.token);
          this.loggedIn.next(true);
          this.usuario.next(res.body);
          return res;
        }),
        catchError((err) => this.handdleError(err))
      );

  }

  public logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.usuario.next(null);
  }

  public checkToken(): void {
    const usuarioToken = localStorage.getItem('token');
    const isExpired = helper.isTokenExpired(usuarioToken);
    isExpired ? this.logout() : this.loggedIn.next(true);
    // set UsuarioIsLogged = true
  }
  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  public handdleError(error: any): Observable<never> {
    let errorMessage = 'Ocurrio un error al recuperar los datos';
    if (error) {
      errorMessage = `Error: code ${error.message}`;
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

  // ====================================================================
  public addUsuario(data: Usuario): any {

  }

  public updateUsuario(data: Usuario): any {

  }
  // ====================================================================
  public getAllUsuarios(): any {

  }
  // ====================================================================
  public getAllUsuariosByTipo(tipoUsuario: Roles): any {

  }
  // ====================================================================
  public getOneUsuario(docid: string): any {

  }
  // ====================================================================
  public deleteUsuario(docid: string): any {

  }
  // ====================================================================

  public registerUsuario(usr: Usuario): any {

  }
  // ====================================================================
  public loginByEmailAndPassword(correo, contrasenha): any {


  }

}
