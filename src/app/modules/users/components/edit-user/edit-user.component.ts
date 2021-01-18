import { UsuarioService } from '@services/usuario.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { Component, Inject, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShowContrasenhaComponent } from '../show-contrasenha/show-contrasenha.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  public usuarioForm: FormGroup;
  disabled = false;

  constructor(
    private toastSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private matDialog: MatDialog,
    private dialogRef: MatDialogRef<EditUserComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  // ============> onInitForm
  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: [this.data.nombre, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoPaterno: [this.data.apellidoPaterno, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      apellidoMaterno: [this.data.apellidoMaterno, [Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)]],
      celular: [this.data.celular,
      [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern(/^[0-9]*$/)]],
      direccion: [this.data.direccion, [Validators.maxLength(200)]],
      correo: [this.data.correo, [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
      rol: [this.data.rol, [Validators.required]],
      username: [this.data.username, [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
      contrasenha: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      autoUsuario: [],
      autoContrasenha: [{ value: '', disabled: true }],
      activo: [this.data.activo ? true : false, [Validators.required]],
      newContrasenha: []
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

  // ===========> oneditUser
  onEditUser(usuario: Usuario): void {
    usuario.uuid = this.data.uuid;
    const { newContrasenha, ...usr }: any = usuario;
    this.usuarioSvc
      .updateUsuario(usuario.uuid, usr)
      .subscribe(usr => {
        if (usr) {
          this.toastSvc.success('El usuario se ha editado correctamente 😀', 'Usuario Editado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          if (newContrasenha) {
            this.matDialog.open(ShowContrasenhaComponent, { data: usr });
            this.dialogRef.close(this.usuarioForm.value);
          }
          this.dialogRef.close(this.usuarioForm.value);

        }
      });
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

  // ===========> onSlideToggle
  onSlideToggle(e): void {

    if (!e.checked) {
      this.usuarioForm.controls['contrasenha'].disable();
      this.usuarioForm.controls['autoContrasenha'].disable();

    } else {
      this.usuarioForm.controls['autoContrasenha'].enable();
      this.usuarioForm.controls['contrasenha'].enable();

    }

  }

}
