import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '@app/core/services/liraki/producto.service';
import { Producto, ProductoView } from '@app/shared/models/liraki/producto.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { CategoriaProductoService } from '@app/core/services/liraki/categoria-producto.service';
import { WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { Router } from '@angular/router';
import { NewCategoriaProductoComponent } from '@app/modules/categoria-producto/components/new-categoria-producto/new-categoria-producto.component';

export interface warningDialog {
  title: string;
  paragraph: string;
  btnPrimary: string;
};

@Component({
  selector: 'app-new-producto',
  templateUrl: './new-producto.component.html',
  styleUrls: ['./new-producto.component.scss']
})
export class NewProductoComponent implements OnInit, OnDestroy {
  public productoForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();
  private categorias: CategoriaProducto[] = [];
  public selectedCategorias: CategoriaProducto[] = [];

  constructor(
    private fb: FormBuilder,
    private productoSvc: ProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewProductoComponent>,
    private categoriaSvc: CategoriaProductoService,
    private matdialog: MatDialog,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.getAllCategorias();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      estado: [true, [Validators.required]],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      categorias: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.pattern(/^[+]?\d+([.]\d+)?$/)]],
      stock: [0, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)$/)]],
      descripcion: ['', Validators.maxLength(1000)]
    });
  }

  private getAllCategorias(): void {
    this.categoriaSvc
      .getAllCategoriaProducto()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categorias: CategoriaProducto[]) => {
        const warningDialog: warningDialog = {
          title: 'Sin Categorias',
          paragraph: 'No hay categorias disponibles para asignar a un nuevo producto.',
          btnPrimary: 'Registrar'
        };
        if (!categorias.length) {
          const dialogRef = this.matdialog.open(WarningModalComponent, {
            data: warningDialog
          });
          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                this.router.navigate(['admin/categoria-producto']);
                this.dialogRef.close(false);
              } else {
                this.dialogRef.close(false);
              }
            });
        }
        this.categorias = categorias;
        this.selectedCategorias = categorias;
      });
  }

  public addProducto(producto: ProductoView): void {
    this.productoSvc
      .addProducto(producto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.toastrSvc.success('El producto se ha creado corectamente. 😀', 'Producto Creado');
        this.dialogRef.close(true);
      });
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedCategorias = this._filter(value);
  }

  // ============> filterCliente
  private _filter(value: string): CategoriaProducto[] {
    const filterValue = value.toLowerCase();

    return this.categorias.filter((categoria: CategoriaProducto) => {
      return categoria.nombre.toLowerCase().indexOf(filterValue) === 0;
    })
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
