import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '@app/core/services/liraki/producto.service';
import { Producto } from '@app/shared/models/liraki/producto.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-producto',
  templateUrl: './new-producto.component.html',
  styleUrls: ['./new-producto.component.scss']
})
export class NewProductoComponent implements OnInit, OnDestroy {
  public productoForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private productoSvc: ProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewProductoComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      estado: [1, [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(300)]],
      categorias: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.pattern(/^[+]?\d+([.]\d+)?$/)]],
      stock: [0, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)$/)]],
      descripcion: ['', Validators.maxLength(200)]
    });
  }

  public addProducto(producto: Producto): void {
    this.productoSvc
      .addProducto(producto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.toastrSvc.success('El producto se ha creado corectamente. 😀', 'Producto Creado');
        this.dialogRef.close(true);
      });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.productoForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

}
