import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '@services/mendoraki/proveedor.service';

import { Proveedor } from '@app/shared/models/mendoraki/proveedor.interface';
import { RecursoService } from '@app/core/services/mendoraki/recurso.service';
import { Recurso } from '@app/shared/models/mendoraki/recurso.interface';
@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrls: ['./add-proveedor.component.scss'],
})
export class AddProveedorComponent implements OnInit, OnDestroy {
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
    private dialogRef: MatDialogRef<AddProveedorComponent>,
    private recursoSvc: RecursoService
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
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      celular: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      direccion: ['', Validators.maxLength(200)],
      descripcion: ['', Validators.maxLength(200)],
      uuidRecurso: ['null', Validators.required],
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
