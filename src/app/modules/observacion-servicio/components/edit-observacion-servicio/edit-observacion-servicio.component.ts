import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ServicioProyecto } from '@models/mendozarq/servicio.proyecto.interface';
import { takeUntil } from 'rxjs/operators';
import { ObservacionServicioService } from '@app/core/services/mendozarq/observacion-servicio.service';
import { ObservacionServicio } from '@app/shared/models/mendozarq/observacion.servicio.interface';
import * as moment from 'moment';


@Component({
  selector: 'app-edit-observacion-servicio',
  templateUrl: './edit-observacion-servicio.component.html',
  styleUrls: ['./edit-observacion-servicio.component.scss']
})
export class EditObservacionServicioComponent implements OnInit {

  private destroy$ = new Subject<any>();
  public servicioForm: FormGroup;

  public estados: Array<string> = ['En curso', 'Pendiente', 'Con retraso', 'Fecha limite', 'Finalizado'];

  constructor(
    private observacionServicioSvc: ObservacionServicioService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditObservacionServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ObservacionServicio) { }

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
      // servicio: [{ value: this.data.servicioProyecto.nombre, disabled: true }],
      estado: [this.data.estado, Validators.required],
      descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(200)]],

    });
  }

  // ===================> addObservacionServicio
  public addObservacionServicio(observacionServicio: ObservacionServicio): void {

    observacionServicio.uuid = this.data.uuid;

    this.observacionServicioSvc.updateObservacionServicio(this.data.uuid, observacionServicio)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('La observacion se ha actualizado correctamente. 😀', 'Observacion Actualizado');
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


}
