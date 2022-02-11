import { CapituloPlanificacionProyecto } from './../../../../shared/models/charts/planificacion.interface';
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
  selector: 'app-edit-capitulo-planificacion',
  templateUrl: './edit-capitulo-planificacion.component.html',
  styleUrls: ['./edit-capitulo-planificacion.component.scss'],
})
export class EditCapituloPlanificacionComponent implements OnInit, OnDestroy {
  public capituloPlanificacionForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();
  public capitulos: TareaPlanificacionProyecto[] = [];
  public dependencias: TareaPlanificacionProyecto[] = [];

  selectedOption: number = 1;
  constructor(
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<EditCapituloPlanificacionComponent>,
    private planificacionSvc: PlanificacionService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      capitulo: CapituloPlanificacionProyecto;
      planificacion: PlanificacionProyectoView;
    }
  ) {}

  ngOnInit(): void {
    this.dependencias = this.data.planificacion.tareas;

    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.capituloPlanificacionForm = this.fb.group({
      nombre: [
        this.data.capitulo.nombre,
        [Validators.required, Validators.maxLength(200)],
      ],
      fechaInicio: [this.data.capitulo.fechaInicio, Validators.required],
      fechaFinal: [this.data.capitulo.fechaFinal, Validators.required],
      avance: [this.data.capitulo.avance],
      dependencia: [this.data.capitulo.dependencia],
      color: [this.data.capitulo.color ? this.data.capitulo.color : '#ffffff'],
    });
  }

  public editPlanificacionProyecto(
    capitulo: CapituloPlanificacionProyecto
  ): void {
    capitulo.color = capitulo.color == '#ffffff' ? '' : capitulo.color;
    capitulo.uuid = this.data.capitulo.uuid;

    this.planificacionSvc
      .updateCapituloPlanificacionProyecto(capitulo.uuid, capitulo)
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(true);
          this.toastrSvc.success(
            'Se ha actualizado correctamente! ',
            'Capítulo Actualizado 😀'
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
    const validateFIeld = this.capituloPlanificacionForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
}
