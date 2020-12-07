import { Usuario } from '@app/shared/models/usuario.interface';
import { Component, Inject, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public editUsuarioForm: FormGroup = new FormGroup({
    nombre: new FormControl(this.data.nombre, Validators.required),
    apellidos: new FormControl(this.data.apellidoPaterno, Validators.required),
    celular: new FormControl(this.data.celular, Validators.required),
    direccion: new FormControl(this.data.direccion, Validators.required),
    correo: new FormControl(this.data.correo, Validators.email),
    rol: new FormControl(this.data.rol, Validators.required)
  });

  constructor(private toastSvc: ToastrService, private authSvc: AuthService, @Inject(MAT_DIALOG_DATA) public data: Usuario) { }

  ngOnInit(): void {
  }

  oneditUser(data: Usuario): void {

    data.uuid = this.data.uuid;


    this.authSvc.updateUsuario(data)
      .then(() => {
        this.toastSvc.success('Correctamente', 'Usuario Editado', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing'
        });
      })
      .catch((error) => {
        console.log('Error:', error);
        this.toastSvc.error('Se ha producido un error.', 'Error al Editar!', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing'
        });
      });
  }

}
