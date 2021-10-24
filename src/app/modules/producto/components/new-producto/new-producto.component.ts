import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductoService } from '@app/core/services/liraki/producto.service';
import { FotoProducto, Producto, ProductoView, ResponseProducto } from '@app/shared/models/liraki/producto.interface';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { CategoriaProductoService } from '@app/core/services/liraki/categoria-producto.service';
import { WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { Router } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export interface warningDialog {
  title: string;
  paragraph: string;
  btnPrimary: string;
};
export class uploadFile {
  file: File;
  progress: number;
  uploaded?: boolean;
  error?: boolean;
  src?: string;
}



@Component({
  selector: 'app-new-producto',
  templateUrl: './new-producto.component.html',
  styleUrls: ['./new-producto.component.scss']
})
export class NewProductoComponent implements OnInit, OnDestroy {
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
    private dialogRef: MatDialogRef<NewProductoComponent>,
    private categoriaSvc: CategoriaProductoService,
    private matdialog: MatDialog,
    private router: Router
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
      .subscribe((res: ResponseProducto) => {
        this.uploadFiles(res.data.uuid);
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


  // !upload files
  // ====================> uploadFiles
  public uploadFiles(uuidProducto: string): void {
    let fjImages: Array<Observable<any>> = [];
    this.isClicked = true;

    this.images.forEach((imageProducto: uploadFile, index) => {
      this.fotoProducto.uuidProducto = uuidProducto;
      this.fotoProducto.size = imageProducto.file.size;

      fjImages.push(this.productoSvc
        .addFotoProyecto(this.fotoProducto, imageProducto.file)
        .pipe(
          takeUntil(this.destroy$),
          tap((event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.images[index].progress = Math.round(event.loaded / event.total * 100);
                break;
              case HttpEventType.Response:
                this.images[index].uploaded = true;
                this.images[index].progress = 0;
            }
          }),
          catchError((error) => {
            this.images[index].error = true;
            this.toastrSvc.error(`La imagen ${imageProducto.file.name} no se pudo subir.`, 'Ocurrio un Error!', {
              timeOut: 7000,
              enableHtml: true
            });
            return of([]);
          }))
      );
    });


    forkJoin(fjImages)
      .subscribe((events: HttpEvent<any>[]) => {
        this.toastrSvc.success(`${this.uploadedCounter()}. 😀`, 'Cargado Correctamente', {
          timeOut: 6000
        });
        this.continue = true;
      });
  }

  private uploadedCounter(): string {
    let counter: number = 0;
    let errors: number = 0;
    this.images.forEach((documento: uploadFile, index) => {
      if (documento.uploaded === true) counter++;
      if (documento.error === true) errors++;
    });
    return (counter > 1 || counter === 0)
      ? `${counter} cargas completas, ${errors} errores.`
      : `${counter} carga completa, ${errors} errores.`;
  }

  // ====================> checkStatusFile
  checkStatusFile(): boolean {
    let status: boolean = true;
    this.images.forEach((documento: uploadFile) => {
      if (documento.uploaded === false) {
        status = false;
      }
    });
    return status;
  }

  // ====================> toggleHover
  public toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  // ====================> onDrop
  public onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.includes('image/') && this.images.length < 4) {
        const reader = new FileReader();
        reader.onload = () => {
          this.images.push({
            file: files.item(i),
            progress: 0,
            src: reader.result as string
          });

        }
        reader.readAsDataURL(files.item(i))
      }

    }
  }
  // =====================> getType
  public getType(nombre: string): string {
    const arrayName = nombre.split('.');
    return arrayName[arrayName.length - 1];
  }
  public onDelete(documento: uploadFile) {
    this.images = this.images.filter((doc: uploadFile) => doc != documento);
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

}
