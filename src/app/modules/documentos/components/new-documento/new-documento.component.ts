import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentosService } from '@app/core/services/mendozarq/documentos.service';

import { DocumentoProyCarpeta, DocumentoProyecto } from '@models/mendozarq/documentos.proyecto.interface';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { runInThisContext } from 'vm';

export class uploadFile {
  file: File;
  progress: number;
  uploaded?: boolean;
  error?: boolean;
}

@Component({
  selector: 'app-new-documento',
  templateUrl: './new-documento.component.html',
  styleUrls: ['./new-documento.component.scss']
})
export class NewDocumentoComponent implements OnInit {

  isHovering: boolean;
  documentos: uploadFile[] = [];
  isClicked: boolean = false;
  continue: boolean = false;


  private destroy$ = new Subject<any>();
  public documentoForm: FormGroup;

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  constructor(
    private documentosSvc: DocumentosService,
    @Inject(MAT_DIALOG_DATA) public documentoData: DocumentoProyCarpeta,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewDocumentoComponent>
  ) { }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ====================> uploadFiles
  public uploadFiles(): void {
    this.isClicked = true;
    this.documentos.forEach((documento: uploadFile, index) => {
      this.documentoData.fechaCreacion = new Date;
      this.documentoData.size = documento.file.size;

      this.documentoData.path === 'root'
        ? this.documentoProyecto(documento, index)
        : this.documentoCarpeta(documento, index);
    });
  }

  // ====================> documentoProyecto
  private documentoProyecto(documento: uploadFile, index) {
    this.documentosSvc.addDocumentoProyecto(this.documentoData, documento.file)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.documentos[index].error = true;
          this.toastrSvc.error(`El archivo ${documento.file.name} no se pudo subir.`, 'Ocurrio un Error!', {
            timeOut: 7000,
            enableHtml: true
          });
          return throwError(error);
        }))
      .subscribe((event: HttpEvent<any>) => {

        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.documentos[index].progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.documentos[index].uploaded = true;

            setTimeout(() => {
              this.documentos[index].progress = 0;
              if (this.checkStatusFile()) {
                this.continue = true;
              }
            }, 1500);
        }
      });
  }

  // ====================> documentoCarpeta
  private documentoCarpeta(documento: uploadFile, index) {
    this.documentosSvc.addDocumentoCarpeta(this.documentoData, documento.file)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.documentos[index].error = true;
          this.toastrSvc.error(`El archivo ${documento.file.name} no se pudo subir.`, 'Ocurrio un Error!', {
            timeOut: 7000,
            enableHtml: true
          });
          return throwError(error);
        }))
      .subscribe((event: HttpEvent<any>) => {

        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.documentos[index].progress = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.documentos[index].uploaded = true;

            setTimeout(() => {
              this.documentos[index].progress = 0;
              if (this.checkStatusFile()) {
                this.continue = true;
              }
            }, 1500);
        }
      });
  }

  // ====================> checkStatusFile
  checkStatusFile(): boolean {
    let status: boolean = true;
    this.documentos.forEach((documento: uploadFile) => {
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
      this.documentos.push({
        file: files.item(i),
        progress: 0
      });
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
