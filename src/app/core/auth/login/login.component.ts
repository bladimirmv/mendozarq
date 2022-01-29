import { BrightnessService } from './../../services/brightness.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import {
  Roles,
  Usuario,
  UsuarioResponse,
} from '@app/shared/models/usuario.interface';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();

  public year: number = new Date().getUTCFullYear();
  public hide = true;

  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('blado959', Validators.required),
    contrasenha: new FormControl('bmvmendo123', Validators.required),
  });

  constructor(
    private authSvc: AuthService,
    private brigthtnessSvc: BrightnessService
  ) {
    this.brigthtnessSvc.reset();
  }

  ngOnInit(): void {
    this.authSvc.checkToken();
    this.checkUserStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  public onLogIn(usr: Usuario): void {
    this.authSvc
      .login(usr)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: UsuarioResponse) => {
        if (res) {
          this.authSvc.roleNavigate(res.body);
        }
      });
  }

  private checkUserStatus(): void {
    this.authSvc.usuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario) => {
        if (usuario) {
          this.authSvc.roleNavigate(usuario);
          console.log();
        }
      });
  }
}
