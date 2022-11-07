import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ObservacionObraService } from '@app/core/services/mendozarq/observacion-obra.service';
import { DeleteModalComponent } from '@shared/components/delete-modal/delete-modal.component';
import { ImgPreviewComponent } from '@shared/components/img-preview/img-preview.component';
import {
  FotoObservacionObra,
  ObservacionObraView,
} from '@shared/models/mendozarq/observacion.obra.interface';

import { environment } from '@env/environment';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

class uploadFile {
  file?: File;
  progress?: number;
  uploaded?: boolean;
  error?: boolean;
  src?: string;
  foto?: FotoObservacionObra;
}
@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss'],
})
export class UploadImagesComponent implements OnInit, OnDestroy {
  private API_URL = environment.API_URL;

  isHovering: boolean;
  fotos: uploadFile[] = [];
  isClicked: boolean = false;
  continue: boolean = false;

  public allUploaded: boolean = false;

  private destroy$ = new Subject<any>();
  public fotoForm: FormGroup;

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };

  constructor(
    @Inject(MAT_DIALOG_DATA) public observacion: ObservacionObraView,
    private toastrSvc: ToastrService,
    private dialogRef: MatDialogRef<UploadImagesComponent>,
    private dialog: MatDialog,
    private observacionSvc: ObservacionObraService
  ) {}

  ngOnInit(): void {
    this.initCurrentFotos();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  initCurrentFotos(): void {
    this.observacion.fotos.forEach((foto: FotoObservacionObra) => {
      this.fotos.push({
        uploaded: true,
        progress: 0,
        src: `${this.API_URL}/api/file/${foto.keyName}`,
        foto,
      });
    });
  }

  public onDelete(image: uploadFile) {
    if (image.foto) {
      const dialogRef = this.dialog.open(DeleteModalComponent);
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.observacionSvc
              .deleteFotoObservacion(image.foto.uuid)
              .pipe(takeUntil(this.destroy$))
              .subscribe(() => {
                this.fotos = this.fotos.filter(
                  (doc: uploadFile) => doc != image
                );
                this.toastrSvc.success(
                  `${image.foto.fileName} se ha eliminado correctamente. 😀`,
                  'Eliminado Correctamente',
                  {
                    timeOut: 6000,
                  }
                );
              });
          }
        });
    } else {
      this.fotos = this.fotos.filter((doc: uploadFile) => doc != image);
    }
  }

  // ====================> uploadFiles
  public uploadFiles(): void {
    moment.locale('es');
    this.isClicked = true;

    let fjFotos: Array<Observable<any>> = [];

    this.fotos.forEach((foto: uploadFile, index) => {
      let fotoData: FotoObservacionObra;
      if (!foto.foto) {
        fotoData = {
          size: foto.file.size,
          uuidObservacionObra: this.observacion.uuid,
        };
        fjFotos.push(
          this.observacionSvc.addFotoObservacion(fotoData, foto.file).pipe(
            takeUntil(this.destroy$),
            tap((event: HttpEvent<any>) => {
              switch (event.type) {
                case HttpEventType.UploadProgress:
                  this.fotos[index].progress = Math.round(
                    (event.loaded / event.total) * 100
                  );
                  break;
                case HttpEventType.Response:
                  this.fotos[index].uploaded = true;
                  this.fotos[index].progress = 0;
              }
            }),
            catchError((error) => {
              this.fotos[index].error = true;
              this.toastrSvc.error(
                `El archivo ${foto.file.name} no se pudo subir.`,
                'Ocurrio un Error!',
                {
                  timeOut: 7000,
                  enableHtml: true,
                }
              );
              return of([]);
            })
          )
        );
      }
    });

    if (fjFotos.length) {
      forkJoin(fjFotos)
        .pipe(takeUntil(this.destroy$))
        .subscribe((events: HttpEvent<any>[]) => {
          this.toastrSvc.success(
            `${this.uploadedCounter()}. 😀`,
            'Cargado Correctamente',
            {
              timeOut: 6000,
            }
          );
          this.continue = true;
        });
    }
  }

  uploadedCounter(): string {
    let counter: number = 0;
    let errors: number = 0;
    this.fotos.forEach((foto: uploadFile, index) => {
      if (foto.uploaded === true) counter++;
      if (foto.error === true) errors++;
    });
    return counter > 1 || counter === 0
      ? `${counter} cargas completas, ${errors} errores.`
      : `${counter} carga completa, ${errors} errores.`;
  }

  // ====================> checkStatusFile
  checkStatusFile(): boolean {
    let status: boolean = true;
    this.fotos.forEach((foto: uploadFile, index) => {
      if (foto.uploaded === false && foto.progress !== 0) {
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
        this.fotos.push({
          file: files.item(i),
          progress: 0,
        });
      }
    }
  }

  public modalPreview(file: uploadFile): void {
    if (file.foto) {
      const keyNames: Array<string> = this.observacion.fotos.map(
        (foto: FotoObservacionObra) =>
          `${this.API_URL}/api/file/${foto.keyName}`
      );
      this.dialog.open(ImgPreviewComponent, {
        data: {
          fotos: keyNames,
          current: keyNames.indexOf(
            `${this.API_URL}/api/file/${file.foto.keyName}`
          ),
        },
        panelClass: 'custom-dialog-container',
      });
    }
  }

  public countFotos(): boolean {
    return !this.fotos.filter((f) => !f.foto).length;
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
