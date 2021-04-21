import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PresupuestosService } from '@app/core/services/mendozarq/presupuestos.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PresupuestoObra } from '@models/mendozarq/presupuestos.interface';
import { map, takeUntil } from 'rxjs/operators';
import { Usuario } from '@app/shared/models/usuario.interface';
import { UsuarioService } from '@app/core/services/auth/usuario.service';
import { ClienteModalComponent } from '@app/modules/proyectos/components/cliente-modal/cliente-modal.component';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-edit-presupuesto',
  templateUrl: './edit-presupuesto.component.html',
  styleUrls: ['./edit-presupuesto.component.scss']
})
export class EditPresupuestoComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();
  public presupuestoForm: FormGroup;

  public selectedClientes: Usuario[] = [];
  private clientes: Usuario[] = [];

  constructor(
    private presupuestoObraSvc: PresupuestosService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPresupuestoComponent>,
    private usuarioSvc: UsuarioService,
    public dialog: MatDialog,
    private router: Router,
    private authSvc: AuthService,
    @Inject(MAT_DIALOG_DATA) private data: PresupuestoObra
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initDataClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.presupuestoForm = this.fb.group({
      nombre: [this.data.nombre, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[0-9a-z\s]+$/)]],
      descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(200)]],
      iva: [this.data.iva, [Validators.required]],
      uuidCliente: [this.data.uuidCliente, Validators.required],
    });
  }

  // ===================> initDataClientes
  private initDataClientes(): void {
    this.usuarioSvc.getAllUsuarios()
      .pipe(map((usuarios: Usuario[]) =>
        usuarios.filter((usuario: Usuario) => usuario.rol === 'cliente')
      ), takeUntil(this.destroy$))
      .subscribe((clientes: Usuario[]) => {
        if (!clientes.length) {
          const dialogRef = this.dialog.open(ClienteModalComponent);

          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (res) {
                dialogRef.close();
                this.dialogRef.close(this.presupuestoForm);
                this.router.navigate(['admin/usuarios']);
              } else {
                dialogRef.close();
                this.dialogRef.close(this.presupuestoForm);
              }
            });
        }
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }

  // ===================> onUpdatePresupuesto
  public onUpdatePresupuesto(presupuestoObra: PresupuestoObra): void {
    presupuestoObra.uuid = this.data.uuid;

    this.presupuestoObraSvc.updatePresupuestoObra(presupuestoObra.uuid, presupuestoObra)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('El presupuesto se ha actualizado correctamente. 😀', 'Presupuesto Actualizado');
          this.dialogRef.close(true);
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.presupuestoForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

  // ===========> getString
  getString(num: number): string {
    return String(num);
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return value + '';
    }
    return value;
  }


  // ============> filterCliente
  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.clientes.filter(cliente => {
      return cliente.nombre.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0;
    })
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedClientes = this._filter(value);
  }

}
