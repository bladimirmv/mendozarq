import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParticipantesProyectoService } from '@app/core/services/mendozarq/participantes-proyecto.service';
import { WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { UsuarioProyecto } from '@app/shared/models/mendozarq/participante.proyecto.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from '@app/shared/models/usuario.interface';
export interface warningDialog {
  title: string;
  paragraph: string;
  btnPrimary: string;
};


@Component({
  selector: 'app-new-usuario-proyecto',
  templateUrl: './new-usuario-proyecto.component.html',
  styleUrls: ['./new-usuario-proyecto.component.scss']
})
export class NewUsuarioProyectoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();

  public usuarioProyectoForm: FormGroup;
  private usuario: Usuario[] = [];
  public selectedUsuario: Usuario[] = [];
  public usuarioGroup: Usuario[] = [];


  constructor(
    private participantesSvc: ParticipantesProyectoService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewUsuarioProyectoComponent>,
    private matdialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private usuarioProyecto: UsuarioProyecto,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllUsuarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.usuarioProyectoForm = this.fb.group({
      usuario: [[], Validators.required]
    });
  }

  private getAllUsuarios(): void {
    this.participantesSvc.getAllUsuarioByUuid(this.usuarioProyecto.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario[]) => {
        this.usuario = usuario;
        this.selectedUsuario = usuario;

        const warningDialog: warningDialog = {
          title: 'Sin Usuarios',
          paragraph: 'No hay usuarios disponible con el rol de arquitecto o administrador para asignar a este proyecto.',
          btnPrimary: 'Registrar'
        };
        if (!usuario.length) {
          const dialogRef = this.matdialog.open(WarningModalComponent, {
            data: warningDialog
          });
          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.router.navigate(['admin/usuarios']);
                this.dialogRef.close(false);
              } else {
                this.dialogRef.close(false);
              }
            });
        }
      });
  }

  public newUsuario(usuario: Usuario[]): void {

    const usuarioProyecto: UsuarioProyecto[] = [];

    usuario.forEach((usr: Usuario) => {
      usuarioProyecto.push({
        uuidUsuario: usr.uuid,
        uuidProyecto: this.usuarioProyecto.uuidProyecto
      })
    });

    this.participantesSvc.addUsuarioProyecto(usuarioProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('Se ha añadido correctamente. 😀',
            usuarioProyecto.length > 1
              ? 'Usuarios Asignado'
              : 'Usuario Asignado');

          this.dialogRef.close(true);
        }
      });
  }



  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.usuarioProyectoForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedUsuario = this._filter(value);
  }

  // ============> filterCliente
  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.usuario.filter(usuario => {
      return usuario.nombre.toLowerCase().indexOf(filterValue) === 0
        || usuario.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0
        || usuario.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0;
    })
  }


}
