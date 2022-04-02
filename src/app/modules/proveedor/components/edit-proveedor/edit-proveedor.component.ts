import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '@services/mendoraki/proveedor.service';

import {
  Proveedor,
  ProveedorView,
} from '@app/shared/models/mendoraki/proveedor.interface';
import { RecursoService } from '@app/core/services/mendoraki/recurso.service';
import { Recurso } from '@app/shared/models/mendoraki/recurso.interface';
@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrls: ['./edit-proveedor.component.scss'],
})
export class EditProveedorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  public proveedorForm: FormGroup;

  private recursos: Recurso[] = [];
  public selectedRecursos: Recurso[] = [];
  public searchRecurso: FormControl = new FormControl();

  constructor(
    private proveedorSvc: ProveedorService,
    private toastrSvc: ToastrService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<EditProveedorComponent>,
    private recursoSvc: RecursoService,
    @Inject(MAT_DIALOG_DATA) private data: ProveedorView
  ) {}

  ngOnInit(): void {
    this.initRecursos();
    this.initForm();

    this.searchRecurso.valueChanges.pipe(startWith('')).subscribe((value) => {
      this.selectedRecursos = this._filter(value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initRecursos(): void {
    this.recursoSvc.getAllRecurso().subscribe((recursos: Recurso[]) => {
      this.recursos = [
        {
          nombre: '-- Ninguno --',
          uuid: 'null',
        },
        ...recursos,
      ];
      this.selectedRecursos = this.recursos;
    });
  }

  public loadSelectRecursos(): void {
    this.selectedRecursos = this.recursos;
    this.searchRecurso.setValue('');
  }

  private _filter(value: string): Recurso[] {
    const filterValue = this._normalizeValue(value);

    return this.recursos.filter((r: Recurso) =>
      this._normalizeValue(r.nombre).includes(filterValue)
    );
  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.proveedorForm = this.fb.group({
      nombre: [
        this.data?.nombre,
        [Validators.required, Validators.maxLength(50)],
      ],
      celular: [
        this.data?.celular,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      direccion: [this.data?.direccion, Validators.maxLength(200)],
      descripcion: [this.data?.descripcion, Validators.maxLength(200)],
      uuidRecurso: [
        this.data?.uuidRecurso ? this.data.uuidRecurso : 'null',
        Validators.required,
      ],
    });
  }

  // ===================> onAddProveedor
  public onAddProveedor(proveedor: Proveedor): void {
    proveedor.uuid = this.data.uuid;
    this.proveedorSvc
      .updateProveedor(proveedor.uuid, proveedor)
      .pipe(takeUntil(this.destroy$))
      .subscribe((proy) => {
        if (proy) {
          this.toastrSvc.success(
            'El proveedor se ha actualizado correctamente. 😀',
            'Proveedor Actualizado'
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
    const validateFIeld = this.proveedorForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }

  public getString(num: number): string {
    return String(num);
  }
}
