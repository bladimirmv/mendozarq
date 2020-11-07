import { AuthService } from '@services/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;

  public formRegistro: FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.email),
    rol: new FormControl('', Validators.required),
    contrasenha: new FormControl('', Validators.required)

  });

  $usuario: Observable<Usuario>;

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
    // this.$usuario = this.authSvc.getOneUsuario()
  }

}
