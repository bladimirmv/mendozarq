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
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subscription = new Subscription();

  public year: number = new Date().getUTCFullYear();

  hide = true;
  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('blado959', Validators.required),
    contrasenha: new FormControl('bmvmendo123', Validators.required),
  });

  public registerForm: FormGroup = new FormGroup({
    docid: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private toastrSvc: ToastrService,
    private brigthtnessSvc: BrightnessService // public gg: WebsocketService
  ) {
    this.brigthtnessSvc.reset();
  }

  ngOnInit(): void {
    this.checkUserStatus();
  }

  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }

  public onLogIn(usr: Usuario): void {
    this.unsubscribe$.add(
      this.authSvc.login(usr).subscribe((res: UsuarioResponse) => {
        if (res) {
          this.authSvc.roleNavigate(res.body);
        }
      })
    );
  }

  private checkUserStatus(): void {
    this.authSvc.usuario$.subscribe((usuario: Usuario) => {
      if (usuario) {
        this.authSvc.roleNavigate(usuario);
      }
    });
  }

  onRegister(usr: Usuario): void {
    // this.authSvc.getOneUsuario(usr.docid)
    //   .subscribe(res => {
    //     if (res) {
    //       if (res.activo === true) {
    //         this.toastrSvc.error('Cuenta en uso', 'Ocurrio un Error!');
    //       } else {
    //         this.router.navigate([`registro/${usr.docid}`]);
    //       }
    //     } else {
    //       this.toastrSvc.error('Codigo incorrecto', 'Ocurrio un Error!');
    //     }
    //   });
  }
}
