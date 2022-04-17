import { startWith } from 'rxjs/operators';
import { DetalleCapituloService } from '@services/mendozarq/detalle-capitulo.service';
import { DetalleCapitulo } from './../../../../shared/models/mendozarq/presupuestos.interface';
import {
  TareaPlanificacionProyecto,
  PlanificacionProyectoView,
} from '@models/charts/planificacion.interface';
import { PlanificacionService } from '@services/mendozarq/planificacion.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
@Component({
  selector: 'app-new-tarea-planificacion',
  templateUrl: './new-tarea-planificacion.component.html',
  styleUrls: ['./new-tarea-planificacion.component.scss'],
})
export class NewTareaPlanificacionComponent implements OnInit, OnDestroy {
  public tareaPlanificacionForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();
  public capitulos: TareaPlanificacionProyecto[] = [];
  public dependencias: TareaPlanificacionProyecto[] = [];

  public filteredOptions: DetalleCapitulo[] = [];
  public detalles: DetalleCapitulo[] = [];
  public currentColor: string = '#ff0000';

  selectedOption: number = 1;
  constructor(
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewTareaPlanificacionComponent>,
    private planificacionSvc: PlanificacionService,
    @Inject(MAT_DIALOG_DATA)
    public planificacionView: PlanificacionProyectoView,
    private detalleCapituloSvc: DetalleCapituloService
  ) {}

  ngOnInit(): void {
    this.capitulos = this.planificacionView.capitulos;
    this.dependencias = this.planificacionView.tareas;

    this.initForm();

    this.detalleCapituloSvc
      .getAllDetalleCapituloByProyecto(this.planificacionView.uuidProyecto)
      .subscribe((detalles: DetalleCapitulo[]) => {
        this.detalles = detalles;
        this.filteredOptions = detalles;
      });

    this.tareaPlanificacionForm
      .get('nombre')
      .valueChanges.pipe(startWith(''))
      .subscribe((value) => {
        this._filterNombre(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  public changeColor(): void {
    document.execCommand('foreColor', false, this.currentColor);
  }

  private _filterNombre(value: string): void {
    const filterValue = value.toLowerCase();

    this.filteredOptions = this.detalles.filter(
      (d) => d.descripcion.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private initForm(): void {
    this.tareaPlanificacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      avance: [0],
      dependencia: [''],
      hito: [false],
      color: ['#ffffff'],
      colorText: '#ff0000',
      uuidCapitulo: ['', Validators.required],
    });
  }

  public newPlanificacionProyecto(
    t: TareaPlanificacionProyecto & { colorText: string }
  ): void {
    const { colorText, ...tarea } = t;
    tarea.color = tarea.color == '#ffffff' ? '' : tarea.color;
    tarea.actividades = document.querySelector('#ul-text').innerHTML;
    this.planificacionSvc
      .addTareaPlanificacionProyecto(tarea)
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(true);
          this.toastrSvc.success(
            'Se ha creado correctamente! ',
            'Tarea Creado 😀'
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
    const validateFIeld = this.tareaPlanificacionForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }

  addList(type: string): void {
    const ul = document.querySelector('#ul-text');

    if (type === 'li') {
      ul.innerHTML += `<li>Nuevo</li>`;
    }

    if (type === 'ol') {
      ul.innerHTML += `<li>Nuevo<ol><li>Sub</li></ol></li>`;
    }
  }
}
