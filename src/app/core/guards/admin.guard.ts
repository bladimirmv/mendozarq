import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { Usuario } from '@shared/models/usuario.interface';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> | boolean {
    return this.authSvc.usuario$.pipe(
      take(1),
      map((usuario: Usuario) => {
        return (
          usuario &&
          (this.authSvc.isAdmin(usuario) ||
            this.authSvc.isArquitecto(usuario) ||
            this.authSvc.isVendedor(usuario))
        );
      }),
      tap((canEdit) => {
        if (!canEdit) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
