import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { RecursoService } from '@services/mendoraki/recurso.service';
import { UsuarioService } from '@services/auth/usuario.service';

import { Recurso } from '@app/shared/models/mendoraki/recurso.interface';

@Component({
  selector: 'app-edit-recurso',
  templateUrl: './edit-recurso.component.html',
  styleUrls: ['./edit-recurso.component.scss'],
})
export class EditRecursoComponent implements OnInit {
  private destroy$ = new Subject<any>();
  public recursoForm: FormGroup;

  constructor(
    private recursoSvc: RecursoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<EditRecursoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Recurso
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
    console.log(this.data);

    this.recursoForm = this.fb.group({
      nombre: [
        this.data?.nombre,
        [Validators.required, Validators.maxLength(50)],
      ],
      tipoRecurso: [this.data?.tipoRecurso, Validators.required],
      area: [this.data?.area, Validators.required],
      precioUnitario: [this.data?.precioUnitario, Validators.maxLength(200)],
      precioPorMayor: [this.data?.precioPorMayor, Validators.required],
      descripcion: [this.data?.descripcion, Validators.maxLength(200)],
      uuid: [this.data?.uuid],
    });
  }

  // ===================> onAddRecurso
  public onEditRecurso(recurso: Recurso): void {
    this.recursoSvc
      .updateRecurso(recurso.uuid, recurso)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'El recurso se ha actualizado correctamente. 😀',
            'Recurso Actializado'
          );
          this.dialogRef.close();
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.recursoForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
}
