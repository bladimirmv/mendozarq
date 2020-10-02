import { Usuario } from '@app/shared/models/usuario.interface';
import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  public newUsuarioForm: FormGroup = new FormGroup({
    nombre: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    celular: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.email),
    rol: new FormControl('', Validators.required)
  });

  constructor(private toastSvc: ToastrService, private authSvc: AuthService) { }

  ngOnInit(): void {
  }

  onAddUser(data: Usuario): void {

    this.authSvc.addUsuario(data)
      .then(() => {
        this.toastSvc.success('Creado correctamente', 'Nuevo Usuario', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing'
        });
      })
      .catch((error) => {
        console.log('Error:', error);
        this.toastSvc.error('Se ha producido un error.', 'Error al Crear!', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing'
        });
      });
  }

}
