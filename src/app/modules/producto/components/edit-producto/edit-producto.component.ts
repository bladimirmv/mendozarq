import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ProductoService } from '@app/core/services/liraki/producto.service';
import {
  FotoProducto,
  Producto,
  ProductoResponse,
  ProductoView,
} from '@app/shared/models/liraki/producto.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EditFotoProductoComponent } from '@modules/producto/components/edit-foto-producto/edit-foto-producto.component';

import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { CategoriaProductoService } from '@app/core/services/liraki/categoria-producto.service';
import {
  warningDialog,
  WarningModalComponent,
} from '@app/shared/components/warning-modal/warning-modal.component';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { uploadFile } from '../new-producto/new-producto.component';
import { environment } from '@env/environment';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { ImgPreviewComponent } from '@app/shared/components/img-preview/img-preview.component';

@Component({
  selector: 'app-edit-producto',
  templateUrl: './edit-producto.component.html',
  styleUrls: ['./edit-producto.component.scss'],
})
export class EditProductoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  private API_URL = environment.API_URL;
  public currentColor: string = '#ff0000';

  public productoForm: FormGroup;
  private categorias: CategoriaProducto[] = [];
  public selectedCategorias: CategoriaProducto[] = [];

  isHovering: boolean;
  images: Array<{ src?: string } & FotoProducto> = [];
  isClicked: boolean = false;
  continue: boolean = false;

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
    @Inject(MAT_DIALOG_DATA) public data: ProductoView
  ) {
    this.initVCurrentFotos();
  }

  ngOnInit(): void {
    this.initForm();
    this.getAllCategorias();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    let mRows: string[] = [];
    this.data.categorias.forEach(async (categoria: CategoriaProducto) => {
      mRows.push(categoria.uuid);
    });

    this.productoForm = this.fb.group({
      uuid: [this.data.uuid],
      estado: [this.data.estado ? true : false, [Validators.required]],
      nombre: [
        this.data.nombre,
        [Validators.required, Validators.maxLength(200)],
      ],
      categorias: [mRows, [Validators.required]],
      precio: [
        this.data.precio,
        [Validators.required, Validators.pattern(/^[+]?\d+([.]\d+)?$/)],
      ],
      stock: [
        this.data.stock,
        [Validators.required, Validators.pattern(/^(0|[1-9]\d*)$/)],
      ],
      // descripcion: [this.data.descripcion, Validators.maxLength(1000)],
      colorText: '#ff0000',
      descuento: [
        this.data.descuento,
        [
          Validators.required,
          Validators.pattern(
            /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/
          ),
        ],
      ],
    });

    const ul = document.querySelector('#ul-text');
    ul.innerHTML = this.data.descripcion;
  }
  private initVCurrentFotos(): void {
    this.images = [];
    this.data.fotos.forEach((foto: FotoProducto) => {
      this.images.push({
        src: `${this.API_URL}/api/file/${foto.keyName}`,
        ...foto,
      });
    });
  }

  public drop(event: CdkDragDrop<uploadFile[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }

  public getDescuento(): string {
    let result: number = 0;
    this.productoForm.value.descuento > 100 ||
    this.productoForm.value.descuento < 0
      ? (result = 0)
      : (result =
          this.productoForm.value.precio -
          (this.productoForm.value.precio * this.productoForm.value.descuento) /
            100);
    return result.toFixed(2);
  }

  private getAllCategorias(): void {
    this.categoriaSvc
      .getAllCategoriaProducto()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categorias: CategoriaProducto[]) => {
        const warningDialog: warningDialog = {
          title: 'Sin Categorias',
          paragraph:
            'No hay categorias disponibles para asignar a un nuevo producto.',
          btnPrimary: 'Registrar',
        };
        if (!categorias.length) {
          const dialogRef = this.matdialog.open(WarningModalComponent, {
            data: warningDialog,
          });
          dialogRef
            .afterClosed()
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

  public editFotoProducto(): void {
    this.images.forEach((v) => {
      delete v.src;
    });
    this.data.fotos = this.images;
    this.initVCurrentFotos();

    const dialogRef = this.matdialog.open(EditFotoProductoComponent, {
      data: this.data,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.productoSvc
            .getFotoProducto(this.data.uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe((fotosProducto: FotoProducto[]) => {
              this.images = [];
              fotosProducto.forEach((foto: FotoProducto) => {
                this.images.push({
                  src: `${this.API_URL}/api/file/${foto.keyName}`,
                  ...foto,
                });
              });
            });
        }
      });
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedCategorias = this._filter(value);
  }

  public onDelete(e: Event, image: FotoProducto) {
    e.stopPropagation();
    const dialogRef = this.matdialog.open(DeleteModalComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.productoSvc
            .deleteFotoProducto(image.uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe((imgRes: ProductoResponse) => {
              this.images = this.images.filter(
                (images: FotoProducto) => images != image
              );
              this.toastrSvc.success(
                `${imgRes.body} se ha eliminado correctamente. 😀`,
                'Eliminado Correctamente',
                {
                  timeOut: 6000,
                }
              );
            });
        }
      });
  }

  public modalPreview(
    e: Event,
    fotos: FotoProducto[],
    foto: FotoProducto
  ): void {
    e.stopPropagation();
    const keyNames: Array<string> = fotos.map(
      (foto: FotoProducto) => `${this.API_URL}/api/file/${foto.keyName}`
    );
    this.matdialog.open(ImgPreviewComponent, {
      data: {
        fotos: keyNames,
        current: keyNames.indexOf(`${this.API_URL}/api/file/${foto.keyName}`),
      },
      panelClass: 'custom-dialog-container',
    });
  }

  public editProducto(
    p: Producto & { categorias: string[]; colorText: string }
  ): void {
    const { colorText, ...producto } = p;
    producto.descripcion = document.querySelector('#ul-text').innerHTML;

    console.log(producto);

    this.productoSvc
      .updateProducto(producto.uuid, producto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toastrSvc.success(
          'El producto se ha actualizado correctamente. 😀',
          'Actualizado Correctamente',
          {
            timeOut: 6000,
          }
        );

        this.dialogRef.close(true);
      });
  }

  // ============> filter
  private _filter(value: string): CategoriaProducto[] {
    const filterValue = value.toLowerCase();

    return this.categorias.filter((categoria: CategoriaProducto) => {
      return categoria.nombre.toLowerCase().indexOf(filterValue) === 0;
    });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.productoForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
  // =====================> getType
  public getType(nombre: string): string {
    const arrayName = nombre.split('.');
    return arrayName[arrayName.length - 1];
  }

  // ======================== formatBytes
  public formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  //*list descripcion
  addList(type: string): void {
    const ul = document.querySelector('#ul-text');

    if (type === 'li') {
      ul.innerHTML += `<li>Nuevo</li>`;
    }

    if (type === 'ol') {
      ul.innerHTML += `<li>Nuevo<ol><li>Sub</li></ol></li>`;
    }
  }

  newLine(): void {
    const ul = document.querySelector('#ul-text');
    ul.innerHTML += `</br>`;
  }

  public changeColor(): void {
    document.execCommand('foreColor', false, this.currentColor);
  }
}
