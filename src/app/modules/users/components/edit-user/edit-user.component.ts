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

  public editUsuarioForm: FormGroup = new FormGroup({
    nombre: new FormControl(this.data.nombre, Validators.required),
    apellidoPaterno: new FormControl(this.data.apellidoPaterno, Validators.required),
    apellidoMaterno: new FormControl(this.data.apellidoMaterno, Validators.required),
    celular: new FormControl(this.data.celular, Validators.required),
    direccion: new FormControl(this.data.direccion, Validators.required),
    correo: new FormControl(this.data.correo, Validators.email),
    rol: new FormControl(this.data.rol, Validators.required),
    username: new FormControl(this.data.username, Validators.required),
    contrasenha: new FormControl({ value: '', disabled: true }, Validators.required),
    autoUsuario: new FormControl(),
    autoContrasenha: new FormControl({ value: '', disabled: true }),
    newContrasenha: new FormControl(),

  });

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
      activo: [true, [Validators.required]]
    });
  }

  oneditUser(usuario: Usuario): void {
    usuario.uuid = this.data.uuid;
    const { newContrasenha, ...usr }: any = usuario;
    this.usuarioSvc
      .updateUsuario(usuario.uuid, usr)
      .subscribe(usr => {
        if (usr) {
          this.toastSvc.success('Correctamente', 'Usuario Editado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          if (newContrasenha) {
            this.matDialog.open(ShowContrasenhaComponent, { data: usr });
            this.dialogRef.close(this.editUsuarioForm.value);
          }
        }
      });
  }

  onCheckBox(usr: Usuario): void {
    if (usr.autoContrasenha === true) {
      this.editUsuarioForm.controls['contrasenha'].disable();
      this.editUsuarioForm.patchValue({
        autoContrasenha: true
      });
    } else {
      this.editUsuarioForm.controls['contrasenha'].enable();
      this.editUsuarioForm.patchValue({
        autoContrasenha: false
      });
    }

    if (usr.autoUsuario === true) {
      this.editUsuarioForm.controls['username'].disable();
      this.editUsuarioForm.patchValue({
        autoUsuario: true
      });
    } else {
      this.editUsuarioForm.controls['username'].enable();
      this.editUsuarioForm.patchValue({
        autoUsuario: false
      });

    }
  }

  onSlideToggle(e): void {

    if (!e.checked) {
      this.editUsuarioForm.controls['contrasenha'].disable();
      this.editUsuarioForm.controls['autoContrasenha'].disable();
      // this.editUsuarioForm.patchValue({
      //   // newContrasenha: true
      // });
    } else {
      this.editUsuarioForm.controls['autoContrasenha'].enable();
      this.editUsuarioForm.controls['contrasenha'].enable();
      // this.editUsuarioForm.patchValue({
      //   // newContrasenha: false
      // });
    }

  }

}
