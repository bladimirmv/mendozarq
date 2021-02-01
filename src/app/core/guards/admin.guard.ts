import { Usuario } from './../../shared/models/usuario.interface';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {
  }
  canActivate(): Observable<boolean> | boolean {
    return this.authSvc.usuario$.pipe(
      take(1),
      map((usuario: Usuario) => {
        return usuario && this.authSvc.isAdmin(usuario)
      }),
      tap(canEdit => {
        if (!canEdit) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
