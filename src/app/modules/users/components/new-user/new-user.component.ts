import { ShowContrasenhaComponent } from './../show-contrasenha/show-contrasenha.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '@app/core/services/auth/usuario.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Component, OnInit } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  public usuarioForm: FormGroup;
  public celularString: string;
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
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoPaterno: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoMaterno: ['', [Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      celular: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern(/^[0-9]*$/)]],
      direccion: ['', [Validators.maxLength(200)]],
      correo: ['', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      rol: ['cliente', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      contrasenha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      autoUsuario: [false],
      autoContrasenha: [false],
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
    // *check autoUsuario
    usr.autoUsuario
      ? this.usuarioForm.controls.username.disable()
      : this.usuarioForm.controls.username.enable();

    // *check autoContrasenha
    usr.autoContrasenha
      ? this.usuarioForm.controls.contrasenha.disable()
      : this.usuarioForm.controls.contrasenha.enable();
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
  // ===========> getString
  getString(num: number): string {
    return String(num);
  }

}
