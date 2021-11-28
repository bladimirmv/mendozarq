import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { CategoriaProductoService } from '@services/liraki/categoria-producto.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { uploadFile } from '@app/modules/producto/components/new-producto/new-producto.component';
@Component({
  selector: 'app-new-categoria-producto',
  templateUrl: './new-categoria-producto.component.html',
  styleUrls: ['./new-categoria-producto.component.scss']
})
export class NewCategoriaProductoComponent implements OnInit, OnDestroy {
  isHovering: boolean;
  documentos: uploadFile[] = [];
  isClicked: boolean = false;
  continue: boolean = false;

  public categoriaForm: FormGroup;

  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private fb: FormBuilder,
    private categoriaProductoSvc: CategoriaProductoService,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewCategoriaProductoComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initForm(): void {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', Validators.maxLength(200)],
      estado: [true, Validators.required]
    });
  }

  public addCategoriaProducto(categoriaProducto: CategoriaProducto): void {
    this.categoriaProductoSvc
      .addCategoriaProducto(categoriaProducto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.toastrSvc.success('La categoria se ha creado corectamente. 😀', 'Categoria Creado');
        this.dialogRef.close(true);
      });
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.categoriaForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
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

  // ====================> onDrop
  public onDrop(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.includes('image/') && this.documentos.length < 1) {
        const reader = new FileReader();
        reader.onload = () => {
          this.documentos.push({
            file: files.item(i),
            progress: 0,
            src: reader.result as string
          });

        }
        reader.readAsDataURL(files.item(i))
      }
    }
  }



  public onDelete(documento: uploadFile) {
    this.documentos = this.documentos.filter((doc: uploadFile) => doc != documento);
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
}
