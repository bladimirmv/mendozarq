import { AuthService } from '@services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {

  }
  canActivate(): Observable<boolean> | boolean {
    return this.authSvc.user$.pipe(
      take(1),
      map(usr => usr[0] && this.authSvc.isAdmin(usr[0])),
      tap(canEdit => {
        if (!canEdit) {
          this.router.navigate(['/login']);
        }
      })
    )
  }

}
