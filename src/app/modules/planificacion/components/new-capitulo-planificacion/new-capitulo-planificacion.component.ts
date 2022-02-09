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
  selector: 'app-new-capitulo-planificacion',
  templateUrl: './new-capitulo-planificacion.component.html',
  styleUrls: ['./new-capitulo-planificacion.component.scss'],
})
export class NewCapituloPlanificacionComponent implements OnInit, OnDestroy {
  public capituloPlanificacionForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();
  public capitulos: TareaPlanificacionProyecto[] = [];
  public dependencias: TareaPlanificacionProyecto[] = [];

  selectedOption: number = 1;
  constructor(
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewCapituloPlanificacionComponent>,
    private planificacionSvc: PlanificacionService,
    @Inject(MAT_DIALOG_DATA)
    public planificacionView: PlanificacionProyectoView
  ) {}

  ngOnInit(): void {
    this.dependencias = this.planificacionView.tareas;

    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.capituloPlanificacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      avance: [0],
      dependencia: [''],
      color: ['#ffffff'],
      uuidPlanificacionProyecto: this.planificacionView.uuid,
    });
  }

  public newPlanificacionProyecto(
    capitulo: CapituloPlanificacionProyecto
  ): void {
    capitulo.color = capitulo.color == '#ffffff' ? '' : capitulo.color;
    capitulo.uuidPlanificacionProyecto = this.planificacionView.uuid;

    this.planificacionSvc
      .addCapituloPlanificacionProyecto(capitulo)
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(true);
          this.toastrSvc.success(
            'Se ha creado correctamente! ',
            'Capítulo Creado 😀'
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
