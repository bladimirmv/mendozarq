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
  selector: 'app-new-carpeta',
  templateUrl: './new-carpeta.component.html',
  styleUrls: ['./new-carpeta.component.scss'],
})
export class NewCarpetaComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  public carpetaForm: FormGroup;

  constructor(
    private documentosSvc: DocumentosService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<NewCarpetaComponent>,
    @Inject(MAT_DIALOG_DATA) public uuidProyecto: string
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
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(4),
        ],
      ],
    });
  }

  // ===================> onAddProyecto
  public onAddProyecto(carpetaProyecto: CarpetaProyecto): void {
    carpetaProyecto.uuidProyecto = this.uuidProyecto;
    carpetaProyecto.fechaCreacion = new Date();

    this.documentosSvc
      .addCarpetaProyecto(carpetaProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'Carpeta creado correctamente. 😀',
            'Carpeta Creado'
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
