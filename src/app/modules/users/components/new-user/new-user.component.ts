import { ShowContrasenhaComponent } from './../show-contrasenha/show-contrasenha.component';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '@services/usuario.service';
import { Usuario, UsuarioResponse } from '@app/shared/models/usuario.interface';
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
    nombre: new FormControl('bladimir', Validators.required),
    apellidoPaterno: new FormControl('medrano', Validators.required),
    apellidoMaterno: new FormControl('vargas', Validators.required),
    celular: new FormControl('69509449', Validators.required),
    direccion: new FormControl('Av segunfa entre marina nunez del prado y calle greco.', Validators.required),
    correo: new FormControl('example@gmail.com', Validators.email),
    rol: new FormControl('administrador', Validators.required),
    username: new FormControl('bladimirmv', Validators.required),
    contrasenha: new FormControl('bmv123', Validators.required),
    autoUsuario: new FormControl(),
    autoContrasenha: new FormControl(),

  });

  constructor(
    private toastrSvc: ToastrService,
    private authSvc: AuthService,
    private usuarioSvc: UsuarioService,
    private matDialog: MatDialog) {

  }



  ngOnInit(): void {
    // this.newUsuarioForm.controls['contrasenha'].disable();
  }

  onCheckBox(usr: Usuario): void {

    if (usr.autoContrasenha === true) {
      this.newUsuarioForm.controls['contrasenha'].disable();
      this.newUsuarioForm.patchValue({
        autoContrasenha: true
      });
    } else {
      this.newUsuarioForm.controls['contrasenha'].enable();
      this.newUsuarioForm.patchValue({
        autoContrasenha: false
      });
    }

    if (usr.autoUsuario === true) {
      this.newUsuarioForm.controls['username'].disable();
      this.newUsuarioForm.patchValue({
        autoUsuario: true
      });
    } else {
      this.newUsuarioForm.controls['username'].enable();
      this.newUsuarioForm.patchValue({
        autoUsuario: false
      });

    }
  }

  onAddUser(usr?: Usuario): void {
    const usuario = this.newUsuarioForm.value;

    this.usuarioSvc.addUsuario(usuario)
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('El usuario se ha creado correctamente', 'Usuario Creado');
          this.matDialog.open(ShowContrasenhaComponent, { data: usr });
        }
      });
  }

  onCloseDialog(): void {
    this.matDialog.closeAll();
  }

}
