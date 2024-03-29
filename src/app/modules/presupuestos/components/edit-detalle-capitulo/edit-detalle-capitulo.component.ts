import { takeUntil } from 'rxjs/operators';
import { DetalleCapituloService } from '@services/mendozarq/detalle-capitulo.service';
import { DetalleCapitulo } from '@models/mendozarq/presupuestos.interface';
import { Unidad } from '@models/mendozarq/presupuestos.interface';
import { Subject } from 'rxjs';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-detalle-capitulo',
  templateUrl: './edit-detalle-capitulo.component.html',
  styleUrls: ['./edit-detalle-capitulo.component.scss']
})
export class EditDetalleCapituloComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();

  public detalleForm: FormGroup;
  public unidades: Array<Unidad> = [
    {
      value: 'N/A', text: 'no aplica'
    },
    {
      value: 'µm', text: 'micra'
    },
    {
      value: 'mm', text: 'milímetro'
    },
    {
      value: 'cm', text: 'centímetro'
    },
    {
      value: 'm', text: 'metro'
    },
    {
      value: 'km', text: 'kilómetro'
    },
    {
      value: 'inch', text: 'pulgada'
    },
    {
      value: 'ft', text: 'pie'
    },
    {
      value: 'yd', text: 'yarda'
    },
    {
      value: 'mi', text: 'milla'
    },
    {
      value: 'ft²', text: 'pie cuadrado'
    },
    {
      value: 'yd²', text: 'yarda cuadrada'
    },
    {
      value: 'mi²', text: 'milla cuadrada'
    },
    {
      value: 'm²', text: 'metro cuadrado'
    },
    {
      value: 'ha', text: 'hectárea'
    },
    {
      value: 'km²', text: 'kilómetro cuadrado'
    },
    {
      value: 'cc', text: 'centímetro cúbico'
    },
    {
      value: 'm3', text: 'metro cúbico'
    },
    {
      value: 'ft3', text: 'pie cúbico'
    },
    {
      value: 'yd3', text: 'yarda cúbica'
    },
    {
      value: 'µl', text: 'microlitro'
    },
    {
      value: 'ml', text: 'mililitro'
    },
    {
      value: 'l', text: 'litro'
    },
    {
      value: 'µg', text: 'microgramo'
    },
    {
      value: 'mg', text: 'miligramo'
    },
    {
      value: 'g', text: 'gramo'
    },
    {
      value: 'kg', text: 'kilogramo'
    },
    { value: 't', text: 'tonelada' },
    {
      value: 'oz', text: 'onza'
    },
    {
      value: 'lb', text: 'libra'
    },
    {
      value: 'gal', text: 'galón'
    },
    {
      value: 'min', text: 'minuto'
    },
    { value: 'hr', text: 'hora' },
    {
      value: 'kWhr', text: 'kilovatio-hora'
    }
  ];
  public selectedUnidades: Array<Unidad> = this.unidades;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: DetalleCapitulo,
    private fb: FormBuilder,
    private detalleCapituloSvc: DetalleCapituloService,
    private dialogRef: MatDialogRef<EditDetalleCapituloComponent>,
    private toastrSvc: ToastrService
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.detalleForm = this.fb.group({
      descripcion: [this.dialogData.descripcion, [Validators.required, Validators.maxLength(300)]],
      unidad: [this.dialogData.unidad, [Validators.required]],
      cantidad: [this.dialogData.cantidad, [Validators.required]],
      precioUnitario: [this.dialogData.precioUnitario, [Validators.required]]
    });
  }

  public updateDetellaCapitulo(detalleCapitulo: DetalleCapitulo) {
    this.detalleCapituloSvc.updateDetalleCapitulo(this.dialogData.uuid, detalleCapitulo)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res) {
          this.toastrSvc.success('El detalle se ha actualizado correctamente. 😀', 'Detalle Actualizado');
          this.dialogRef.close(true);
        }
      });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.detalleForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedUnidades = this._filter(value);
  }
  private _filter(value: string): Array<Unidad> {
    const filterValue = value.toLowerCase();

    return this.unidades.filter((unidad: Unidad) => {
      return unidad.value.toLowerCase().indexOf(filterValue) === 0
        || unidad.text.toLowerCase().indexOf(filterValue) === 0
    })
  }


}
