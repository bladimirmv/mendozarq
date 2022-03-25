import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth/auth.service';
import { Usuario } from './../../shared/models/usuario.interface';
import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsuarioResolverService implements Resolve<Usuario> {
  constructor(private _authSvc: AuthService) {}

  resolve(): Observable<Usuario | null> {
    return this._authSvc.usuario$.pipe(take(1));
  }
}
