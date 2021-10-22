import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from '@app/core/services/liraki/producto.service';
import { FotoProducto, Producto, ProductoView, ResponseProducto } from '@app/shared/models/liraki/producto.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { CategoriaProductoService } from '@app/core/services/liraki/categoria-producto.service';
import { warningDialog, WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { Router } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { uploadFile } from '../new-producto/new-producto.component';

@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.scss']
})
export class EditProductoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();

  public productoForm: FormGroup;
  private categorias: CategoriaProducto[] = [];
  public selectedCategorias: CategoriaProducto[] = [];


  isHovering: boolean;
  images: uploadFile[] = [];
  isClicked: boolean = false;
  continue: boolean = false;
  private fotoProducto: FotoProducto = { uuidProducto: '' };

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  constructor(
    private fb: FormBuilder,
    private productoSvc: ProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<EditProductoComponent>,
    private categoriaSvc: CategoriaProductoService,
    private matdialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: ProductoView
  ) { }


  drop(event: CdkDragDrop<uploadFile[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }


  ngOnInit(): void {
    this.initForm();
    this.getAllCategorias();



  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  ongg(): void {
    console.log(this.productoForm);

  }

  private initForm(): void {
    let mRows: string[] = [];
    this.data.categorias.forEach(async (categoria: CategoriaProducto) => {
      mRows.push(categoria.uuid);
    });

    this.productoForm = this.fb.group({
      estado: [this.data.estado ? true : false, [Validators.required]],
      nombre: [this.data.nombre, [Validators.required, Validators.maxLength(100)]],
      categorias: [mRows, [Validators.required]],
      precio: [this.data.precio, [Validators.required, Validators.pattern(/^[+]?\d+([.]\d+)?$/)]],
      stock: [this.data.stock, [Validators.required, Validators.pattern(/^(0|[1-9]\d*)$/)]],
      descripcion: [this.data.descripcion, Validators.maxLength(1000)]
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
      .subscribe((res: ResponseProducto) => {
        // this.uploadFiles(res.data.uuid);
        console.log(res);

      });
  }


  // ============> onKeySearch
  public onKey(value) {
    this.selectedCategorias = this._filter(value);
    this.ongg();
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
