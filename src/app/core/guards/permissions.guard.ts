import { Injectable } from '@angular/core';
import { Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';

import { Usuario } from './../../shared/models/usuario.interface';
import { AuthService } from '@app/core/services/auth/auth.service';

import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivateChild {
  constructor(private authSvc: AuthService, private router: Router) {}
  canActivateChild(): boolean | Observable<boolean> {
    return this.authSvc.usuario$.pipe(
      take(1),
      map((usuario: Usuario) => {
        return usuario && this.authSvc.isAdmin(usuario);
      }),
      tap((canEdit) => {
        if (!canEdit) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
