import { PlanificacionService } from '@services/mendozarq/planificacion.service';
import { PlanificacionProyecto } from '@models/charts/planificacion.interface';
import { takeUntil } from 'rxjs/operators';
import { Proyecto } from '@models/mendozarq/proyecto.interface';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

@Component({
  selector: 'app-new-planificacion-proyecto',
  templateUrl: './new-planificacion-proyecto.component.html',
  styleUrls: ['./new-planificacion-proyecto.component.scss'],
})
export class NewPlanificacionProyectoComponent implements OnInit, OnDestroy {
  public planificacionForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();

  private proyecto: Proyecto = {} as Proyecto;

  constructor(
    private fb: FormBuilder,
    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewPlanificacionProyectoComponent>,
    private planificacionSvc: PlanificacionService,
    @Inject(MAT_DIALOG_DATA) private uuidProyecto
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.proyectoSvc
      .getOneProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proyecto: Proyecto) => {
        this.proyecto = proyecto;
        this.initForm();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.planificacionForm = this.fb.group({
      titulo: [
        this.proyecto.nombre,
        [Validators.required, Validators.maxLength(200)],
      ],
      subtitulo: [this.proyecto.descripcion, Validators.maxLength(200)],
    });
  }

  public newPlanificacionProyecto(
    planificacionProyecto: PlanificacionProyecto
  ): void {
    planificacionProyecto.uuidProyecto = this.uuidProyecto;
    this.planificacionSvc
      .addPlanificacionProyecto(planificacionProyecto)
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(true);
          this.toastrSvc.success(
            'Se ha creado correctamente! ',
            'Planificación Creado 😀'
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
    const validateFIeld = this.planificacionForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
}
