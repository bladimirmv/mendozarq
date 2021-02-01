import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RoleValidator } from '@core/helpers/roleValidator';
import { Usuario } from '@app/shared/models/usuario.interface';
import { UsuarioResponse } from '@shared/models/usuario.interface';
import { environment } from '@env/environment';

const helper = new JwtHelperService();
@Injectable({
  providedIn: 'root'
})
export class AuthService extends RoleValidator {
  private API_URL = environment.API_URL;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private usuario = new BehaviorSubject<Usuario>(null);
  public usuario$: Observable<Usuario> = this.usuario.asObservable();
  private usuarioToken = new BehaviorSubject<string>(null);
  // ====================================================================
  constructor(private http: HttpClient, private toastrSvc: ToastrService) {
    super();
    this.checkToken();
  }
  // ====================================================================
  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get userTokenValue(): string {
    return this.usuarioToken.getValue();
  }
  // ====================================================================
  public login(authData: Usuario): Observable<UsuarioResponse | void> {
    return this.http.post<UsuarioResponse>(`${this.API_URL}/api/auth/login`, authData)
      .pipe(
        map((usuario: UsuarioResponse) => {
          this.saveToken(usuario.token);
          this.loggedIn.next(true);
          this.usuario.next(usuario.body);
          this.usuarioToken.next(usuario.token);
          return usuario;
        }),
        catchError((err) => this.handdleError(err))
      );

  }
  // ====================================================================
  public logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.usuario.next(null);
    this.usuarioToken.next(null);
  }
  // ====================================================================
  public checkToken(): any {
    const usuarioToken = localStorage.getItem('token') || null;
    if (usuarioToken) {
      const isExpired = helper.isTokenExpired(usuarioToken);
      const { iat, exp, ...usuarioJwt } = helper.decodeToken(usuarioToken);

      if (isExpired) {
        this.logout();
        this.toastrSvc.error('La sesion ha expirado, porfavor inicia sesion nuevamente', 'Sesion Expirada!', {
          timeOut: 5000
        });
      } else {
        this.loggedIn.next(true);
        this.usuarioToken.next(usuarioToken);
        this.usuario.next(usuarioJwt);
      }
    }
  }
  // ====================================================================
  public saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  // ====================================================================
  public handdleError(httpError: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (httpError) {
      typeof httpError.error.message === 'string'
        ? errorMessage = `${httpError.error.message}`
        : errorMessage = `
        Error: ${httpError.statusText} </br>
        Status: ${httpError.status}`;
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
