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
  selector: 'app-edit-planificacion-proyecto',
  templateUrl: './edit-planificacion-proyecto.component.html',
  styleUrls: ['./edit-planificacion-proyecto.component.scss'],
})
export class EditPlanificacionProyectoComponent implements OnInit, OnDestroy {
  public planificacionForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();

  private proyecto: Proyecto = {} as Proyecto;

  constructor(
    private fb: FormBuilder,
    private proyectoSvc: ProyectoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<EditPlanificacionProyectoComponent>,
    private planificacionSvc: PlanificacionService,
    @Inject(MAT_DIALOG_DATA) private planificaion: PlanificacionProyecto
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.planificacionForm = this.fb.group({
      titulo: [
        this.planificaion.titulo,
        [Validators.required, Validators.maxLength(200)],
      ],
      subtitulo: [this.planificaion.subtitulo, Validators.maxLength(200)],
    });
  }

  public newPlanificacionProyecto(
    planificacionProyecto: PlanificacionProyecto
  ): void {
    planificacionProyecto.uuid = this.planificaion.uuid;

    this.planificacionSvc

      .updatePlanificacionProyecto(
        planificacionProyecto.uuid,
        planificacionProyecto
      )
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(true);
          this.toastrSvc.success(
            'Se ha actualizado correctamente! ',
            'Planificación Actualizado 😀'
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
