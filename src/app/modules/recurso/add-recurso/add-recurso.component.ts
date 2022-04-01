import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { RecursoService } from '@services/mendoraki/recurso.service';
import { UsuarioService } from '@services/auth/usuario.service';

import { Recurso } from '@app/shared/models/mendoraki/recurso.interface';

@Component({
  selector: 'app-add-recurso',
  templateUrl: './add-recurso.component.html',
  styleUrls: ['./add-recurso.component.scss'],
})
export class AddRecursoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  public recursoForm: FormGroup;

  constructor(
    private recursoSvc: RecursoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<AddRecursoComponent>
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
    this.recursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      tipoRecurso: ['materia_prima', Validators.required],
      area: ['mendozarq', Validators.required],
      precioUnitario: [0, Validators.maxLength(200)],
      precioPorMayor: [0, Validators.required],
      descripcion: ['', Validators.maxLength(200)],
    });
  }

  // ===================> onAddRecurso
  public onAddRecurso(recurso: Recurso): void {
    this.recursoSvc
      .addRecurso(recurso)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'El recurso se ha creado correctamente. 😀',
            'Recurso Creado'
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
