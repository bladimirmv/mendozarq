import { WebsocketService } from './../../services/sockets/websocket.service';
import { BrightnessService } from './../../services/brightness.service';
import { AuthService } from '@services/auth.service';
import { Usuario, UsuarioResponse } from '@app/shared/models/usuario.interface';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
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

  private unsubscribe$: Subscription = new Subscription();
  hide = true;
  public loginForm: FormGroup = new FormGroup({
    username: new FormControl('blado959', Validators.required),
    contrasenha: new FormControl('bmvmendo123', Validators.required)
  });

  public registerForm: FormGroup = new FormGroup({
    docid: new FormControl('', Validators.required)
  });

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private toastrSvc: ToastrService,
    private brigthtnessSvc: BrightnessService,
    public gg: WebsocketService
  ) {
    this.brigthtnessSvc.reset();
  }


  getapi() {


  }

  ngOnInit(): void {



    // fetch('http://localhost:3000/api/usuario', {
    //   method: 'get'
    // })
    //   .then(result => result.json())
    //   .then(data => console.log(data))
    //   .catch(error => console.log(error));



    // fetch('http://localhost:3000/api/usuario/0a984c59-5cc1-41d7-8895-b0ad083faf1d', {
    //   method: 'get'
    // })
    //   .then(res => res.json())
    //   .then(data => {

    //     if (data.error) {
    //       console.log('hubo un error');
    //     } else {
    //       console.log(data);

    //     }
    //   })
    //   .catch(error => console.log('error', error));


  }


  ngOnDestroy(): void {
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }

  onLogIn(usr: Usuario): void {

    this.unsubscribe$.add(
      this.authSvc.login(usr)
        .subscribe((res: UsuarioResponse) => {
          if (res) {
            switch (res.body.rol) {
              case 'administrador':
                this.router.navigate(['/admin']);
                this.toastrSvc.info(res.body.nombre, 'Bienvenido! 👋');
                break;
              default:
                break;
            }
          }
        })
    );

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
