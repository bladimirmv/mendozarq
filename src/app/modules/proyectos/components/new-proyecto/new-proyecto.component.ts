import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { UsuarioService } from '@services/auth/usuario.service';

import { ClienteModalComponent } from './../cliente-modal/cliente-modal.component';
import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { Usuario } from '@app/shared/models/usuario.interface';


@Component({
  selector: 'app-new-proyecto',
  templateUrl: './new-proyecto.component.html',
  styleUrls: ['./new-proyecto.component.scss']
})
export class NewProyectoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  public proyectoForm: FormGroup;
  private clientes: Usuario[] = [];
  public selectedClientes: Usuario[] = [];

  constructor(
    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<NewProyectoComponent>) { }

  ngOnInit(): void {
    this.initForm();
    this.initDataClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[0-9a-z\s]+$/)]],
      descripcion: ['', Validators.maxLength(200)],
      estado: [true, Validators.required],
      fechaInicio: [Validators.required],
      fechaFinal: [Validators.required],
      lugarProyecto: ['', Validators.maxLength(200)],
      uuidCliente: ['', Validators.required],
      categoria: ['construccion', Validators.required]
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
            .subscribe((res: boolean) => {
              if (res) {
                dialogRef.close();
                this.dialogRef.close(this.proyectoForm);
                this.router.navigate(['admin/usuarios']);
              } else {
                dialogRef.close();
                this.dialogRef.close(this.proyectoForm);
              }
            });
        }
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }

  // ===================> onAddProyecto
  public onAddProyecto(proyecto: Proyecto): void {
    proyecto.porcentaje = 0;
    this.proyectoSvc.addProyecto(proyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(proy => {
        if (proy) {
          this.toastrSvc.success('El proyecto se ha creado correctamente. 😀', 'Proyecto Creado');
          this.dialogRef.close();
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.proyectoForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedClientes = this._filter(value);
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

}
