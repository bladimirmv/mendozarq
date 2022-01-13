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

import { DocumentosService } from '@app/core/services/mendozarq/documentos.service';
import { DocumentoProyecto } from '@app/shared/models/mendozarq/documentos.proyecto.interface';

@Component({
  selector: 'app-edit-documento',
  templateUrl: './edit-documento.component.html',
  styleUrls: ['./edit-documento.component.scss'],
})
export class EditDocumentoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  public documentoForm: FormGroup;

  constructor(
    private documentosSvc: DocumentosService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditDocumentoComponent>,
    @Inject(MAT_DIALOG_DATA) public documentoProyecto: DocumentoProyecto
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
    this.documentoForm = this.fb.group({
      nombre: [
        this.trimExtension(this.documentoProyecto.nombre),
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(4),
        ],
      ],
    });
  }

  // ===================> updateDocumento
  public updateDocumento(documentoProyecto: DocumentoProyecto): void {
    documentoProyecto.uuid = this.documentoProyecto.uuid;

    const arrayName = this.documentoProyecto.nombre.split('.');
    documentoProyecto.nombre += `.${arrayName[arrayName.length - 1]}`;

    this.documentosSvc
      .updateDocumentoProyecto(documentoProyecto.uuid, documentoProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'Documento actualizado correctamente. 😀',
            'Documento actualizado'
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
    const validateFIeld = this.documentoForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }

  // =====================> trimExtension
  public trimExtension(nombre: string): string {
    return nombre.split('.').slice(0, -1).join('.');
  }
}
