import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { warningDialog, WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Usuario } from '@app/shared/models/usuario.interface';
import { ParticipanteVisitaService } from '@app/core/services/mendozarq/participante-visita.service';
import { ParticipanteVisita } from '@app/shared/models/mendozarq/participante.visita.interface';
import { VisitasPendientesComponent } from '../visitas-pendientes/visitas-pendientes.component';
@Component({
  selector: 'app-new-usuario-visita',
  templateUrl: './new-usuario-visita.component.html',
  styleUrls: ['./new-usuario-visita.component.scss']
})
export class NewUsuarioVisitaComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();

  public usuarioVisitaForm: FormGroup;
  private usuario: Usuario[] = [];
  public selectedUsuario: Usuario[] = [];
  public usuarioGroup: Usuario[] = [];


  constructor(
    private participanteVisitaSvc: ParticipanteVisitaService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewUsuarioVisitaComponent>,
    private matdialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private uuidVisita: string,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllUsuarios();

    console.log(this.uuidVisita);

  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.usuarioVisitaForm = this.fb.group({
      usuario: [[], Validators.required],
    });
  }

  // ====================> getAllUsuarios
  private getAllUsuarios(): void {
    this.participanteVisitaSvc.getAllUsuarioByUuidVisita(this.uuidVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usuario: Usuario[]) => {
        this.usuario = usuario;
        this.selectedUsuario = usuario;

        const warningDialog: warningDialog = {
          title: 'Sin Usuarios',
          paragraph: 'No hay usuarios disponibles en el proyecto para asignar a esta visita.',
          btnPrimary: 'Continuar'
        };

        if (!usuario.length) {
          const dialogRef = this.matdialog.open(WarningModalComponent, {
            data: warningDialog
          });
          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              this.dialogRef.close(false);
            });
        }
      });
  }

  // ====================> newUsuario
  public newUsuario(usuario: Usuario[]): void {
    const usuarioVisita: ParticipanteVisita[] = [];

    usuario.forEach((usr: Usuario) => {
      usuarioVisita.push({
        uuidUsuario: usr.uuid,
        uuidVisitaProyecto: this.uuidVisita
      })
    });
    this.participanteVisitaSvc.addParticipanteVisita(usuarioVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('Se ha añadido correctamente. 😀',
            usuarioVisita.length > 1
              ? 'Usuarios Asignado'
              : 'Usuario Asignado');
          this.dialogRef.close(true);
        }
      });
  }

  // ====================> visitasPendientes
  public visitasPendientes(usuario: Usuario) {
    const dialogRef = this.matdialog.open(VisitasPendientesComponent, {
      data: usuario
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.dialogRef.close();
        }
      });
  }



  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.usuarioVisitaForm.get(field);
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
