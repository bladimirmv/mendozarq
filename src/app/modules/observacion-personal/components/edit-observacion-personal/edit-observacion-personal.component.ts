import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ObservacionPersonal } from '@app/shared/models/mendozarq/observacion.personal.interface';
import * as moment from 'moment';
import { Personal } from '@app/shared/models/mendozarq/personal.interface';
import { ObservacionPersonalService } from '@app/core/services/mendozarq/observacion-personal.service';

@Component({
  selector: 'app-edit-observacion-personal',
  templateUrl: './edit-observacion-personal.component.html',
  styleUrls: ['./edit-observacion-personal.component.scss']
})
export class EditObservacionPersonalComponent implements OnInit {
  public selectedPersonal: Personal[] = [];
  public personal: Personal[] = [];

  private destroy$ = new Subject<any>();
  public personalForm: FormGroup;
  public estados: Array<string> = ['En curso', 'Pendiente', 'Fecha limite', 'Aprobar', 'Con retraso', 'Finalizado'];

  constructor(
    private observacionPersonalSvc: ObservacionPersonalService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditObservacionPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ObservacionPersonal) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllPersonalProyecto();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ============> onInitForm
  private initForm(): void {
    this.personalForm = this.fb.group({
      estado: [this.data.estado, Validators.required],
      descripcion: [this.data.descripcion, [Validators.required, Validators.maxLength(200)]],
    });
  }

  // ====================> getAllPersonalProyecto
  public getAllPersonalProyecto(): void {
    this.observacionPersonalSvc
      .getAllPersonalByUuidVisita(this.data.uuidVisita)
      .pipe(takeUntil(this.destroy$))
      .subscribe((personal: Personal[]) => {
        this.selectedPersonal = personal;
        this.personal = personal;
      });
  }

  // ===================> updateObservacionPersonal
  public updateObservacionPersonal(observacionPersonal: ObservacionPersonal): void {
    observacionPersonal.uuid = this.data.uuid;

    this.observacionPersonalSvc.updateObservacionPersonal(this.data.uuid, observacionPersonal)
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
    const validateFIeld = this.personalForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }
}
