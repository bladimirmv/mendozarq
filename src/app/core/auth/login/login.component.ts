import { switchMap } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
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


  onLogIn(Usr: Usuario): void {
    console.log('1', Usr);
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

}
