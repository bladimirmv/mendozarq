import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { observable, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { UsuarioService } from '@services/auth/usuario.service';

import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { Usuario } from '@app/shared/models/usuario.interface';
import { EditProyectoComponent } from '../edit-proyecto/edit-proyecto.component';
@Component({
  selector: 'app-descripcion-proyecto',
  templateUrl: './descripcion-proyecto.component.html',
  styleUrls: ['./descripcion-proyecto.component.scss'],
})
export class DescripcionProyectoComponent implements OnInit {
  hide = true;

  private uuidProyecto: string = '';
  public proyecto: Proyecto & {
    nombreCliente?: string;
    apellidoPaterno?: string;
    apellidoMaterno?: string;
  };

  private destroy$ = new Subject<any>();

  public proyectoForm: FormGroup;
  private clientes: Usuario[] = [];
  public selectedClientes: Usuario[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,

    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initDataClientes();
    this.uuidProyecto = this.activatedRoute.snapshot.parent.params.uuid;

    this.proyectoSvc
      .getOneProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cliente) => {
        this.proyecto = cliente;
        this.initForm();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.proyectoForm = this.fb.group({
      nombre: [
        this.proyecto.nombre,
        [Validators.required, Validators.maxLength(50)],
      ],
      descripcion: [this.proyecto.descripcion, Validators.maxLength(200)],
      estado: [this.proyecto.estado ? true : false, Validators.required],
      fechaInicio: [this.proyecto.fechaInicio, Validators.required],
      fechaFinal: [this.proyecto.fechaFinal, Validators.required],
      lugarProyecto: [this.proyecto.lugarProyecto, Validators.maxLength(200)],
      uuidCliente: [this.proyecto.uuidCliente, Validators.required],
      categoria: [this.proyecto.categoria, Validators.required],
    });
  }

  // ===================> getProyecto
  private getProyecto(): void {}

  // ===================> initDataClientes
  private initDataClientes(): void {
    this.usuarioSvc
      .getAllUsuarios()
      .pipe(
        map((usuarios: Usuario[]) =>
          usuarios.filter((usuario: Usuario) => usuario.rol === 'cliente')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((clientes: Usuario[]) => {
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }

  // ===================> onUpdateProyecto
  public onUpdateProyecto(proyecto: Proyecto): void {
    this.proyectoSvc
      .updateProyecto(this.proyecto.uuid, proyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'El proyecto se ha actualizado correctamente. 😀',
            'Proyecto Actualizado'
          );
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.proyectoForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
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

    return this.clientes.filter((cliente) => {
      return (
        cliente.nombre.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0
      );
    });
  }
}
