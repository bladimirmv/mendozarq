import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '@services/mendoraki/proveedor.service';
import { UsuarioService } from '@services/auth/usuario.service';

import { Proveedor } from '@app/shared/models/mendoraki/proveedor.interface';
@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrls: ['./add-proveedor.component.scss'],
})
export class AddProveedorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();

  public proveedorForm: FormGroup;

  constructor(
    private proveedorSvc: ProveedorService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddProveedorComponent>
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
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      tipoProveedor: ['materia_prima', Validators.required],
      area: ['mendozarq', Validators.required],
      precioUnitario: [0, Validators.maxLength(200)],
      precioPorMayor: [0, Validators.required],
      descripcion: ['', Validators.maxLength(200)],
    });
  }

  // ===================> onAddProveedor
  public onAddProveedor(proveedor: Proveedor): void {
    this.proveedorSvc
      .addProveedor(proveedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'El proveedor se ha creado correctamente. 😀',
            'Proveedor Creado'
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
    const validateFIeld = this.proveedorForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
}
