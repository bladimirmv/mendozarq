import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicioProyectoService } from '@app/core/services/mendozarq/servicio-proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServicioProyecto } from '@models/mendozarq/servicio.proyecto.interface';
import { takeUntil } from 'rxjs/operators';
import { ObservacionServicioService } from '@app/core/services/mendozarq/observacion-servicio.service';
import { ObservacionServicio } from '@app/shared/models/mendozarq/observacion.servicio.interface';
import * as moment from 'moment';


@Component({
  selector: 'app-new-observacion-servicio',
  templateUrl: './new-observacion-servicio.component.html',
  styleUrls: ['./new-observacion-servicio.component.scss']
})
export class NewObservacionServicioComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();
  public servicioForm: FormGroup;

  public estados: Array<string> = ['En curso', 'Pendiente', 'Con retraso', 'Fecha limite', 'Finalizado'];

  constructor(
    private observacionServicioSvc: ObservacionServicioService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewObservacionServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { servicioProyecto: ServicioProyecto, uuidVisita: string }) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.servicioForm = this.fb.group({
      servicio: [{ value: this.data.servicioProyecto.nombre, disabled: true }],
      estado: ['En curso', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(200)]],

    });
  }

  // ===================> addObservacionServicio
  public addObservacionServicio(observacionServicio: ObservacionServicio): void {

    observacionServicio.uuidServicio = this.data.servicioProyecto.uuid;
    observacionServicio.uuidVisita = this.data.uuidVisita;
    observacionServicio.fecha = new Date(moment().format('YYYY-MM-DD'));

    console.log(observacionServicio.fecha);


    this.observacionServicioSvc.addObservacionServicio(observacionServicio)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('La observacion se ha creado correctamente. 😀', 'Observacion Creado');
          this.dialogRef.close(true);
        }

      });

  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.servicioForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }


  getTime(date: Date): string {
    moment.locale('es');
    return moment(date).format('MMMM Do YYYY');
  }
}
