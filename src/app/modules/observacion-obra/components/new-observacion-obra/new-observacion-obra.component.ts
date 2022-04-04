import { ObservacionObra } from '@models/mendozarq/observacion.obra.interface';
import { Component, OnInit, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ObservacionObraService } from '@app/core/services/mendozarq/observacion-obra.service';

@Component({
  selector: 'app-new-observacion-obra',
  templateUrl: './new-observacion-obra.component.html',
  styleUrls: ['./new-observacion-obra.component.scss'],
})
export class NewObservacionObraComponent implements OnInit {
  public observacionForm: FormGroup;

  constructor(
    private observacionSvc: ObservacionObraService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<NewObservacionObraComponent>,
    @Inject(MAT_DIALOG_DATA) private uuidVisita: string
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.observacionForm = this.fb.group({
      puntoDeInspeccion: ['', [Validators.required, Validators.maxLength(200)]],
      observacion: ['', [Validators.required, Validators.maxLength(200)]],
      levantamientoObservacion: [
        '',
        [Validators.required, Validators.maxLength(200)],
      ],
      uuidVisita: [this.uuidVisita],
    });
  }

  // ===================> onAddObservacion
  public onAddObservacion(observacion: ObservacionObra): void {
    this.observacionSvc.addObservacionObra(observacion).subscribe((proy) => {
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
