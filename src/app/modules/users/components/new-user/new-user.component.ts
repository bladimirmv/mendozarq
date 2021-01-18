import { ShowContrasenhaComponent } from './../show-contrasenha/show-contrasenha.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '@services/usuario.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  public usuarioForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private authSvc: AuthService,
    private usuarioSvc: UsuarioService,
    private matDialog: MatDialog,
    private dialogRef: MatDialogRef<NewUserComponent>) {

  }

  ngOnInit(): void {
    this.initForm();
  }
  // ============> onInitForm
  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['bladimir', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoPaterno: ['medrano', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoMaterno: ['vargas', [Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      celular: ['69509449', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern(/^[0-9]*$/)]],
      direccion: ['Avenida Segunda', [Validators.maxLength(200)]],
      correo: ['example@gamil.com', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      rol: ['cliente', [Validators.required]],
      username: ['blado123', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      contrasenha: ['example12345', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      autoUsuario: [''],
      autoContrasenha: [''],
      activo: [true, [Validators.required]],
    });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.usuarioForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

  // ===========> onCheckBox
  onCheckBox(usr: Usuario): void {
    if (usr.autoContrasenha === true) {
      this.usuarioForm.controls['contrasenha'].disable();
      this.usuarioForm.patchValue({
        autoContrasenha: true
      });
    } else {
      this.usuarioForm.controls['contrasenha'].enable();
      this.usuarioForm.patchValue({
        autoContrasenha: false
      });
    }

    if (usr.autoUsuario === true) {
      this.usuarioForm.controls['username'].disable();
      this.usuarioForm.patchValue({
        autoUsuario: true
      });
    } else {
      this.usuarioForm.controls['username'].enable();
      this.usuarioForm.patchValue({
        autoUsuario: false
      });
    }
  }

  // ===========> onAddUusario
  onAddUser(usr?: Usuario): void {
    const usuario = this.usuarioForm.value;

    this.usuarioSvc.addUsuario(usuario)
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('El usuario se ha creado correctamente. 😀', 'Usuario Creado');
          this.matDialog.open(ShowContrasenhaComponent, { data: usr });
          this.dialogRef.close(this.usuarioForm.value);
        }
      });
  }

  // ===========> onCloseDIalog
  onCloseDialog(): void {
    this.matDialog.closeAll();
  }

}
