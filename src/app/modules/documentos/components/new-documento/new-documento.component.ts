import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentosService } from '@app/core/services/mendozarq/documentos.service';

import { DocumentoProyecto } from '@models/mendozarq/documentos.proyecto.interface';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    @Inject(MAT_DIALOG_DATA) public uuidProyecto: string,
    private fb: FormBuilder,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<NewDocumentoComponent>

  ) { }


  ngOnInit(): void {
    // this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // =====================> onInitForm
  private initForm(): void {
    this.documentoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(4), Validators.pattern(/^[0-9a-z\s]+$/)]]
    });
  }

  // ====================> uploadFiles
  public uploadFiles(): void {
    this.isClicked = true;
    this.documentos.forEach((documento: uploadFile, index) => {
      this.documentosSvc.addDocument({ uuidProyecto: this.uuidProyecto } as DocumentoProyecto, documento.file)
        .pipe(catchError(error => {
          this.documentos[index].error = true;
          this.toastrSvc.error(`El archivo ${documento.file.name} no se pudo subir.`, 'Ocurrio un Error!', {
            timeOut: 7000,
            enableHtml: true
          });
          return throwError(error);
        }))
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.documentos[index].progress = Math.round(100 * event.loaded / event.total);

          } else if (event instanceof HttpResponse) {
            this.documentos[index].uploaded = true;
            if (this.checkStatusFile()) {
              console.log('puede continuar');

              this.continue = true;
            }
          }
        });
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

  public formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
