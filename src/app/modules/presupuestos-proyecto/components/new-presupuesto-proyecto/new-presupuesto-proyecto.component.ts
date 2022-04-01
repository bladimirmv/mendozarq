import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { startWith } from 'rxjs/operators';
import { PresupuestoObra } from '@models/mendozarq/presupuestos.interface';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { PresupuestosService } from '@app/core/services/mendozarq/presupuestos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-presupuesto-proyecto',
  templateUrl: './new-presupuesto-proyecto.component.html',
  styleUrls: ['./new-presupuesto-proyecto.component.scss'],
})
export class NewPresupuestoProyectoComponent implements OnInit {
  public presupuestoForm: FormGroup;
  public searchPresupuesto: FormControl = new FormControl();
  public selectedPresupuestos: PresupuestoObra[] = [];
  public presupuestos: PresupuestoObra[] = [];

  constructor(
    private fb: FormBuilder,
    private _presupuestoSvc: PresupuestosService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewPresupuestoProyectoComponent>,
    @Inject(MAT_DIALOG_DATA) private uuidProyecto
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.searchPresupuesto.valueChanges
      .pipe(startWith(''))
      .subscribe((value) => {
        this.selectedPresupuestos = this._filter(value);
      });

    this._presupuestoSvc.getAllPresupuestos().subscribe((presupuestos) => {
      this.selectedPresupuestos = presupuestos;
      this.presupuestos = presupuestos;
    });
  }

  public addPresupuesto(presupuesto: PresupuestoObra | string): void {
    if (typeof presupuesto === 'string') {
      this._presupuestoSvc
        .addPresupuestoProyecto(this.uuidProyecto)
        .subscribe(() => {
          this.toastrSvc.success(
            '😀 Se ha creado correnctamente.',
            'Presupuesto Creado'
          );

          this.dialogRef.close(true);
        });
      return;
    }
    presupuesto.uuidProyecto = this.uuidProyecto;

    this._presupuestoSvc
      .importPresupuestoProyecto(presupuesto as PresupuestoObra)
      .subscribe(() => {
        this.toastrSvc.success(
          '😀 Se ha importado correnctamente.',
          'Presupuesto Importado'
        );
        this.dialogRef.close(true);
      });
  }

  // =====================> onInitForm
  private initForm(): void {
    this.presupuestoForm = this.fb.group({
      presupuesto: ['nuevo', Validators.required],
    });
  }

  loadSelectPresupuestos() {
    this.selectedPresupuestos = this.presupuestos;
    this.searchPresupuesto.setValue('');
  }

  private _filter(value: string): PresupuestoObra[] {
    const filterValue = this._normalizeValue(value);

    return this.presupuestos.filter((pre) => {
      return pre.nombre.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase();
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.presupuestoForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
}
