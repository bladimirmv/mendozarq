import { BrightnessService } from './../../core/services/brightness.service';
import { ShowContrasenhaComponent } from './../users/components/show-contrasenha/show-contrasenha.component';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '@app/core/services/auth/usuario.service';
import { Subject } from 'rxjs';

import { take } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth/auth.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  public darkTheme: boolean = false;

  public empty: boolean = false;
  public usuarioForm: FormGroup;
  public celularString: string;
  public usuario: Usuario = {};

  constructor(
    private fb: FormBuilder,
    private toastSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private matDialog: MatDialog,
    private authSvc: AuthService,
    private route: ActivatedRoute,
    public brightnessSvc: BrightnessService
  ) {
    this.brightnessSvc.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.darkTheme = res;
      });
  }

  ngOnInit(): void {
    this.usuario = this.route.snapshot.data['usuario'];

    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.usuarioForm = this.fb.group({
      nombre: [
        this.usuario.nombre,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-z\s]+$/),
        ],
      ],
      apellidoPaterno: [
        this.usuario.apellidoPaterno,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-z\s]+$/),
        ],
      ],
      apellidoMaterno: [
        this.usuario.apellidoMaterno,
        [Validators.maxLength(50), Validators.pattern(/^[a-z\s]+$/)],
      ],
      celular: [
        this.usuario.celular === 0 ? '' : this.usuario.celular,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      direccion: [this.usuario.direccion, [Validators.maxLength(200)]],
      correo: [
        this.usuario.correo,
        [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)],
      ],
      username: [
        this.usuario.username,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
        ],
      ],
      contrasenha: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      autoUsuario: [false],
      autoContrasenha: [{ value: false, disabled: true }],
      rol: [this.usuario.rol, [Validators.required]],
      newContrasenha: [false],
    });
  }

  private getUsuario(): void {
    this.authSvc.usuario$.pipe(take(1)).subscribe((usrToken: Usuario) => {
      this.usuarioSvc
        .getOneUsuario(usrToken.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((usr: Usuario) => {
          this.usuario = usr;
          this.initForm();
        });
    });
  }

  // ===========> oneditUser
  onEditUser(usuario: Usuario): void {
    usuario.uuid = this.usuario.uuid;
    const { newContrasenha, ...usr }: any = usuario;
    this.usuarioSvc.updateUsuario(usuario.uuid, usr).subscribe((usr) => {
      if (usr) {
        this.toastSvc.success(
          'Tus datos se han editado correctamente 😀',
          'Usuario Editado',
          {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing',
          }
        );
        this.getUsuario();
        if (newContrasenha) {
          this.matDialog.open(ShowContrasenhaComponent, { data: usr });
        }

        this.authSvc.usuario.next(usr);
      }
    });
  }

  // ===========> onCheckBox
  onCheckBox(usr: { newContrasenha: boolean } & Usuario): void {
    // *check autoUsuario
    usr.autoUsuario
      ? this.usuarioForm.controls.username.disable()
      : this.usuarioForm.controls.username.enable();

    // *check autoContrasenha
    usr.newContrasenha
      ? usr.autoContrasenha
        ? this.usuarioForm.controls.contrasenha.disable()
        : this.usuarioForm.controls.contrasenha.enable()
      : false;
  }

  // ===========> onSlideToggle
  onSlideToggle(usr: { newContrasenha: boolean } & Usuario): any {
    if (usr.newContrasenha) {
      this.usuarioForm.controls.autoContrasenha.enable();
      this.usuarioForm.controls.contrasenha.enable();
      this.usuarioForm.patchValue({
        autoContrasenha: false,
      });
    } else {
      this.usuarioForm.controls.autoContrasenha.disable();
      this.usuarioForm.controls.contrasenha.disable();
    }
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.usuarioForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
  // ===========> getString
  getString(num: number): string {
    return String(num);
  }

  // ===================> clearForm
  public clearForm(): void {
    this.usuarioForm.reset();
    this.empty = true;
  }
  // =====================>
  public fillOutForm(): void {
    this.initForm();
    this.empty = false;
  }

  // *appearence
  formatLabel(value: number) {
    return Math.round(((value - 40) * 100) / 60);
  }

  public changeRadio(value: boolean): void {
    this.darkTheme = value;
    this.toogleTheme();
  }

  onBrightness(e): void {
    this.brightnessSvc.ChangeValue(e.value);
  }

  public toogleTheme(): void {
    this.brightnessSvc.toggleTheme(this.darkTheme);
  }
}
