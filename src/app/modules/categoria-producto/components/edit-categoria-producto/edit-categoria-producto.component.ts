import { environment } from '@env/environment';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import {
  NewCategoriaProductoComponent,
  uploadFile,
} from './../new-categoria-producto/new-categoria-producto.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaProductoService } from '@services/liraki/categoria-producto.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil, tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-edit-categoria-producto',
  templateUrl: './edit-categoria-producto.component.html',
  styleUrls: ['./edit-categoria-producto.component.scss'],
})
export class EditCategoriaProductoComponent implements OnInit, OnDestroy {
  public categoriaForm: FormGroup;

  public isHovering: boolean;
  public documentos: uploadFile[] = [] as uploadFile[];
  public isClicked: boolean = false;
  public continue: boolean = false;

  private API_URL = environment.API_URL;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private categoriaProductoSvc: CategoriaProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewCategoriaProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaProducto
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.categoriaForm = this.fb.group({
      nombre: [
        this.data.nombre,
        [Validators.required, Validators.maxLength(50)],
      ],
      descripcion: [this.data.descripcion, Validators.maxLength(200)],
      estado: [!!this.data.estado],
    });

    if (this.data.keyName) {
      this.documentos.push({
        progress: 100,
        uploaded: true,
        categoria: this.data,
        src: `${this.API_URL}/api/file/${this.data.keyName}`,
      });
    }
  }

  public updateCategoriaProducto(categoriaProducto: CategoriaProducto): void {
    categoriaProducto.uuid = this.data.uuid;

    if (this.documentos[0].isNew) {
      this.isClicked = true;
      categoriaProducto.size = this.documentos[0].file.size;

      this.categoriaProductoSvc
        .updateCategoriaProducto(
          categoriaProducto.uuid,
          categoriaProducto,
          this.documentos[0].file
        )
        .pipe(
          tap((event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.documentos[0].progress = Math.round(
                  (event.loaded / event.total) * 100
                );
                break;
              case HttpEventType.Response:
                this.documentos[0].uploaded = true;
                this.documentos[0].progress = 0;
            }
          }),
          catchError(() => {
            this.documentos[0].error = true;
            this.toastrSvc.error(
              `La imagen ${this.documentos[0].file.name} no se pudo subir.`,
              'Ocurrio un Error!',
              {
                timeOut: 7000,
                enableHtml: true,
              }
            );
            return of([]);
          })
        )
        .subscribe(() => {
          this.continue = true;
          this.toastrSvc.success(
            'La categoria se ha creado corectamente. 😀',
            'Categoria Creado'
          );
        });
      return;
    }

    this.categoriaProductoSvc
      .updateCategoriaProducto(categoriaProducto.uuid, categoriaProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.toastrSvc.success(
          'La categoria se ha creado corectamente. 😀',
          'Categoria Creado'
        );
        this.dialogRef.close(true);
      });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.categoriaForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
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
  // =====================> getType
  public getType(nombre: string): string {
    const arrayName = nombre.split('.');
    return arrayName[arrayName.length - 1];
  }

  checkStatusFile(): boolean {
    let status: boolean = true;
    this.documentos.forEach((documento: uploadFile, index) => {
      if (documento.uploaded === false && documento.progress !== 0) {
        status = false;
      }
    });
    return status;
  }

  // ====================> toggleHover
  public toggleHover(event: boolean): void {
    this.isHovering = event;
  }

  public onDelete(documento: uploadFile) {
    this.documentos = this.documentos.filter(
      (doc: uploadFile) => doc != documento
    );
  }

  // ====================> onDrop
  public onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      if (
        files.item(i).type.includes('image/') &&
        this.documentos.length === 0
      ) {
        const reader = new FileReader();
        reader.onload = () => {
          this.documentos.push({
            file: files.item(i),
            progress: 0,
            src: reader.result as string,
            isNew: true,
          });
        };
        reader.readAsDataURL(files.item(i));
        return;
      }
    }
  }
}
