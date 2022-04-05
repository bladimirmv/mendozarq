import { ObservacionObra } from '@models/mendozarq/observacion.obra.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ObservacionObraService } from '@app/core/services/mendozarq/observacion-obra.service';

@Component({
  selector: 'app-edit-observacion-obra',
  templateUrl: './edit-observacion-obra.component.html',
  styleUrls: ['./edit-observacion-obra.component.scss'],
})
export class EditObservacionObraComponent implements OnInit {
  public observacionForm: FormGroup;

  constructor(
    private observacionSvc: ObservacionObraService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditObservacionObraComponent>,
    @Inject(MAT_DIALOG_DATA) private observacion: ObservacionObra
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.observacionForm = this.fb.group({
      puntoDeInspeccion: [
        this.observacion?.puntoDeInspeccion,
        [Validators.required, Validators.maxLength(200)],
      ],
      observacion: [
        this.observacion?.observacion,
        [Validators.required, Validators.maxLength(200)],
      ],
      levantamientoObservacion: [
        this.observacion?.levantamientoObservacion,
        [Validators.required, Validators.maxLength(200)],
      ],
      uuidVisita: [this.observacion?.uuidVisita],
      uuid: [this.observacion.uuid],
    });
  }

  // ===================> onAddObservacion
  public onUpdateObservacion(observacion: ObservacionObra): void {
    this.observacionSvc
      .updateObservacionObra(observacion.uuid, observacion)
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'El observacion se ha creado correctamente. 😀',
            'Observacion Creado'
          );
          this.dialogRef.close(true);
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.observacionForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
}
