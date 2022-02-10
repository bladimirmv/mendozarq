import {
  TareaPlanificacionProyecto,
  PlanificacionProyectoView,
} from '@models/charts/planificacion.interface';
import { PlanificacionService } from '@services/mendozarq/planificacion.service';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn,
  FormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
@Component({
  selector: 'app-edit-tarea-planificacion',
  templateUrl: './edit-tarea-planificacion.component.html',
  styleUrls: ['./edit-tarea-planificacion.component.scss'],
})
export class EditTareaPlanificacionComponent implements OnInit {
  public tareaPlanificacionForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();
  public capitulos: TareaPlanificacionProyecto[] = [];
  public dependencias: TareaPlanificacionProyecto[] = [];

  selectedOption: number = 1;
  constructor(
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<EditTareaPlanificacionComponent>,
    private planificacionSvc: PlanificacionService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tarea: TareaPlanificacionProyecto;
      planificacion: PlanificacionProyectoView;
    }
  ) {}

  ngOnInit(): void {
    this.capitulos = this.data.planificacion.capitulos;
    this.dependencias = this.data.planificacion.tareas.filter(
      (tarea: TareaPlanificacionProyecto) => tarea.uuid !== this.data.tarea.uuid
    );

    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.tareaPlanificacionForm = this.fb.group({
      nombre: [
        this.data.tarea.nombre,
        [Validators.required, Validators.maxLength(200)],
      ],
      fechaInicio: [new Date(this.data.tarea.fechaInicio), Validators.required],
      fechaFinal: [new Date(this.data.tarea.fechaFinal), Validators.required],
      avance: [this.data.tarea.avance],
      dependencia: [this.data.tarea.dependencia],
      hito: [this.data.tarea.hito],
      color: [this.data.tarea.color],
      uuidCapitulo: [this.data.tarea.uuidCapitulo, Validators.required],
    });
  }

  public editPlanificacionProyecto(tarea: TareaPlanificacionProyecto): void {
    tarea.color = tarea.color == '#ffffff' ? '' : tarea.color;
    tarea.uuid = this.data.tarea.uuid;

    this.planificacionSvc
      .updateTareaPlanificacionProyecto(tarea.uuid, tarea)
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close(true);
          this.toastrSvc.success(
            'Se ha actualizado correctamente! ',
            'Tarea Actualizada 😀'
          );
        }
      });
  }

  private oneValueHasToBeChangedValidator(
    values: { controlName: string; initialValue: string | number | boolean }[]
  ): ValidatorFn {
    return (form: FormControl): { [key: string]: any } => {
      let sameValues = true;

      for (let comparingValues of values) {
        if (
          form.value[comparingValues.controlName] !=
          comparingValues.initialValue
        ) {
          sameValues = false;
          break;
        }
      }

      return sameValues ? { sameValues: { values: values } } : null;
    };
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
}
