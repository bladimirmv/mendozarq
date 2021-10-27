import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from '@app/core/services/liraki/producto.service';
import { FotoProducto, Producto, ProductoResponse, ProductoView, ResponseProducto } from '@app/shared/models/liraki/producto.interface';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { CategoriaProductoService } from '@app/core/services/liraki/categoria-producto.service';
import { warningDialog, WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';
import { Router } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { uploadFile } from '../new-producto/new-producto.component';
import { environment } from '@env/environment';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';

@Component({
  selector: 'app-edit-foto-producto',
  templateUrl: './edit-foto-producto.component.html',
  styleUrls: ['./edit-foto-producto.component.scss']
})
export class EditFotoProductoComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();
  private API_URL = environment.API_URL;


  public productoForm: FormGroup;
  private categorias: CategoriaProducto[] = [];
  public selectedCategorias: CategoriaProducto[] = [];


  isHovering: boolean;
  images: uploadFile[] = [];
  isClicked: boolean = false;
  continue: boolean = false;
  // private fotoProducto: FotoProducto = { uuidProducto: '' };

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };


  constructor(
    private fb: FormBuilder,
    private productoSvc: ProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<EditFotoProductoComponent>,
    private categoriaSvc: CategoriaProductoService,
    private matdialog: MatDialog,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: ProductoView

  ) { }

  ngOnInit(): void {
    this.initVCurrentFotos();
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  initVCurrentFotos(): void {
    this.data.fotos.forEach((foto: FotoProducto) => {
      this.images.push({
        uploaded: true,
        progress: 0,
        src: `${this.API_URL}/api/file/${foto.keyName}`,
        foto
      });
    });

  }


  drop(event: CdkDragDrop<uploadFile[]>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
  }
  // !upload files
  // ====================> uploadFiles
  public uploadFiles(): void {
    let fjImages: Array<Observable<any>> = [];
    this.isClicked = true;



    this.images.forEach((imageProducto: uploadFile, index) => {

      let fotoProducto: FotoProducto = { uuidProducto: '' };


      if (imageProducto.foto) {
        this.images[index].progress = 0;
        fotoProducto = imageProducto.foto;
        fotoProducto.indice = index;

        fjImages.push(this.productoSvc
          .updateFotoProducto(fotoProducto.uuid, fotoProducto)
          .pipe(takeUntil(this.destroy$))
        );
      } else {
        fotoProducto.indice = index;
        fotoProducto.uuidProducto = this.data.uuid;
        fotoProducto.size = imageProducto.file.size;
        fjImages.push(this.productoSvc
          .addFotoProyecto(fotoProducto, imageProducto.file)
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
      }


    });

    forkJoin(fjImages)
      .subscribe((events: HttpEvent<any>[]) => {

        this.toastrSvc.success(`${this.uploadedCounter()}. 😀`, 'Cargado Correctamente', {
          timeOut: 6000
        });
        this.continue = true;

        this.dialogRef.close(true);
      });
  }



  public onDelete(image: uploadFile) {
    if (image.foto) {
      const dialogRef = this.matdialog.open(DeleteModalComponent);
      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.productoSvc.deleteFotoProducto(image.foto.uuid)
              .pipe(takeUntil(this.destroy$))
              .subscribe((imgRes: ProductoResponse) => {
                this.images = this.images.filter((doc: uploadFile) => doc != image);
                this.toastrSvc.success(`${imgRes.body} se ha eliminado correctamente. 😀`, 'Eliminado Correctamente', {
                  timeOut: 6000
                });
              })
          }
        });
    } else {
      this.images = this.images.filter((doc: uploadFile) => doc != image);
    }
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
      if (files.item(i).type.includes('image/')) {
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
