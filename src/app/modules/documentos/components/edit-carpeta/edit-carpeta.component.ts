import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';

import { CarpetaProyecto } from '@app/shared/models/mendozarq/documentos.proyecto.interface';
import { DocumentosService } from '@app/core/services/mendozarq/documentos.service';

@Component({
  selector: 'app-edit-carpeta',
  templateUrl: './edit-carpeta.component.html',
  styleUrls: ['./edit-carpeta.component.scss'],
})
export class EditCarpetaComponent implements OnInit {
  private destroy$ = new Subject<any>();

  public carpetaForm: FormGroup;

  constructor(
    private documentosSvc: DocumentosService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditCarpetaComponent>,
    @Inject(MAT_DIALOG_DATA) public carpetaProyecto: CarpetaProyecto
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.carpetaForm = this.fb.group({
      nombre: [
        this.carpetaProyecto.nombre,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(4),
        ],
      ],
    });
  }

  // ===================> onUpdateProyecto
  public onUpdateProyecto(carpetaProyecto: CarpetaProyecto): void {
    carpetaProyecto.uuid = this.carpetaProyecto.uuid;

    console.log(carpetaProyecto);

    this.documentosSvc
      .updateCarpetaProyecto(carpetaProyecto.uuid, carpetaProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'Carpeta actualizado correctamente. 😀',
            'Carpeta actualizado'
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
    const validateFIeld = this.carpetaForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
}
