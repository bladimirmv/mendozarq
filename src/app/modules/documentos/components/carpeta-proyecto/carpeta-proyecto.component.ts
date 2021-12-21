import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import {
  DocumentoProyCarpeta,
  DocumentoProyecto,
} from '@models/mendozarq/documentos.proyecto.interface';
import { DocumentosService } from '@services/mendozarq/documentos.service';
import { Subject } from 'rxjs';

import { environment } from '@env/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { NewDocumentoComponent } from '../new-documento/new-documento.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { EditDocumentoComponent } from '../edit-documento/edit-documento.component';
import { InfoDocumentoComponent } from '../info-documento/info-documento.component';

@Component({
  selector: 'app-carpeta-proyecto',
  templateUrl: './carpeta-proyecto.component.html',
  styleUrls: ['./carpeta-proyecto.component.scss'],
})
export class CarpetaProyectoComponent implements OnInit, OnDestroy {
  private API_URL = environment.API_URL;

  public documentos: DocumentoProyecto[] = [];

  private destroy$ = new Subject<any>();
  private uuidProyecto: string = '';
  private uuidCarpeta: string = '';

  @HostListener('window:click', ['$event'])
  onClick(event) {
    document.querySelector('#main_contextmenu').classList.remove('active');
    document.querySelector('#folder_contextmenu').classList.remove('active');
    document.querySelector('#document_contextmenu').classList.remove('active');
  }
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: any) {
    event.preventDefault();
    console.log(event);

    const main_menu = document.querySelector(
      '#main_contextmenu'
    ) as HTMLDivElement;
    main_menu.style.top = event.offsetY + 'px';
    main_menu.style.left = event.offsetX + 'px';
    console.log(event.target.id);

    if (
      event.target.id !== 'content' &&
      event.target.id !== 'list' &&
      event.target.id !== 'main'
    ) {
      main_menu.classList.remove('active');
    } else {
      const folder_menu = document.querySelector(
        '#folder_contextmenu'
      ) as HTMLDivElement;
      const doc_menu = document.querySelector(
        '#document_contextmenu'
      ) as HTMLDivElement;
      folder_menu.classList.remove('active');
      doc_menu.classList.remove('active');
      main_menu.classList.add('active');
    }
  }

  constructor(
    private documentosSvc: DocumentosService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toastrSvc: ToastrService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    this.uuidCarpeta = this.activatedRoute.snapshot.params.uuid;
    this.getAllDocumentos();
  }
  // =====================> onDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
  public syncData(): void {
    this.getAllDocumentos();
  }

  // =====================> getAllDocumentos
  private getAllDocumentos(): void {
    this.documentosSvc
      .getAllDocumentoCarpetaByUuid(this.uuidCarpeta, 'folder')
      .pipe(takeUntil(this.destroy$))
      .subscribe((documentos: DocumentoProyecto[]) => {
        this.documentos = documentos;
      });
  }

  // =====================> newDocumentoCarpeta
  public newDocumento(): void {
    const documento: DocumentoProyCarpeta = {
      uuidProyecto: this.uuidProyecto,
      uuidCarpeta: this.uuidCarpeta,
      path: 'folder',
    };
    const matOptions: MatDialogConfig = {
      data: documento,
      width: '600px',
      height: 'auto',
      maxWidth: '600px',
      minWidth: '200px',
    };

    const dialogRef = this.dialog.open(NewDocumentoComponent, matOptions);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllDocumentos();
      });
  }

  // =====================> deleteDocumento
  public deleteDocumento(uuid: string): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.documentosSvc
            .deleteDocumentoProyecto(uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.toastrSvc.success(
                'Documento eliminado correctamente. 😀',
                'Documento Eliminado'
              );
              this.getAllDocumentos();
            });
        }
      });
  }
  // =====================> updateDocumento
  public updateDocumento(documentoProyecto: DocumentoProyecto): void {
    const dialogRef = this.dialog.open(EditDocumentoComponent, {
      data: documentoProyecto,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllDocumentos();
        }
      });
  }

  // =====================> downloadFile
  public downloadFile(documento: DocumentoProyecto): void {
    fetch(`${this.API_URL}/api/file/${documento.keyName}`, {
      method: 'GET',
    })
      .then((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', documento.nombre);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        this.toastrSvc.error(
          'No se pudo descargar el archivo. 🙁',
          'Ocurrio un Error!'
        );
      });
  }

  public infoDocumento(documentoProyecto: DocumentoProyecto): void {
    this.dialog.open(InfoDocumentoComponent, { data: documentoProyecto });
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

  public onBack(): void {
    this.location.back();
  }
}
