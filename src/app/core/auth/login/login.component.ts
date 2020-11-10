import { switchMap, map, subscribeOn } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subscription;
  hide = true;
  public loginForm: FormGroup = new FormGroup({
    correo: new FormControl('', Validators.required),
    contrasenha: new FormControl('', Validators.required)
  });

  public registerForm: FormGroup = new FormGroup({
    docid: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private toastrSvc: ToastrService) { }

  ngOnInit(): void {
  }

  onLogIn(usr: Usuario): void {
    this.authSvc.loginByEmailAndPassword(usr.correo, usr.contrasenha)
      .then(() => {

        this.unsubscribe$ = this.authSvc.user$
          .subscribe(res => {
            switch (res[0].rol) {
              case 'administrador':
                this.router.navigate(['/admin']);
                break;
              default:
                break;
            }
            this.toastrSvc.info(res[0].nombre, 'Bienvenido!');
          });

      })
      .catch(error => {
        this.toastrSvc.success(error, 'Ocurrio un error!');
      });


  }

  onRegister(usr: Usuario): void {
    this.authSvc.getOneUsuario(usr.docid)
      .subscribe(res => {
        if (res) {
          this.router.navigate([`registro/${usr.docid}`]);
        } else {
          this.toastrSvc.error('Codigo incorrecto', 'Ocurrio un Error!');
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

}
