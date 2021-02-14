import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';


import { CarpetaProyecto, DocumentoProyecto } from '@models/mendozarq/documentos.proyecto.interface';
import { DocumentosService } from '@services/mendozarq/documentos.service';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewCarpetaComponent } from './components/new-carpeta/new-carpeta.component';
import { ActivatedRoute } from '@angular/router';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { EditCarpetaComponent } from './components/edit-carpeta/edit-carpeta.component';
import { NewDocumentoComponent } from './components/new-documento/new-documento.component';
import { environment } from '@env/environment';
import { EditDocumentoComponent } from './components/edit-documento/edit-documento.component';
import { InfoDocumentoComponent } from './components/info-documento/info-documento.component';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit, OnDestroy {

  private API_URL = environment.API_URL;


  public carpetas: CarpetaProyecto[] = [];
  public documentos: DocumentoProyecto[] = [];

  private destroy$ = new Subject<any>();
  private uuidProyecto: string = '';


  @HostListener('window:click', ['$event'])
  onClick(event) {
    document.querySelector('#main_contextmenu').classList.remove('active');
    document.querySelector('#folder_contextmenu').classList.remove('active');
    document.querySelector('#document_contextmenu').classList.remove('active');
  }
  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: any) {
    event.preventDefault();
    const main_menu = document.querySelector("#main_contextmenu") as HTMLDivElement;
    main_menu.style.top = event.offsetY + "px";
    main_menu.style.left = event.offsetX + "px";

    if (event.target.id !== 'content' && event.target.id !== 'list' && event.target.id !== 'main') {
      main_menu.classList.remove('active');
    } else {
      const folder_menu = document.querySelector("#folder_contextmenu") as HTMLDivElement;
      const doc_menu = document.querySelector("#document_contextmenu") as HTMLDivElement;
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

  ) {

  }

  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    this.getAllCarpetas();
    this.getAllDocumentos();

  }
  // =====================> onDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  public syncData(): void {
    this.getAllCarpetas();
    this.getAllDocumentos();
  }

  // =====================> getAllCarpetas
  private getAllCarpetas(): void {
    this.documentosSvc
      .getAllCarpetaProyectoByUuid(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((carpetas: CarpetaProyecto[]) => {
        this.carpetas = carpetas;
      })
  }

  // =====================> newCarpeta
  public newCarpeta(): void {

    const dialogRef = this.dialog.open(NewCarpetaComponent, { data: this.uuidProyecto });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllCarpetas();
        }
      });
  }

  // =====================> deleteCarpeta
  public deleteCarpeta(uuid: string): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.documentosSvc.deleteCarpetaProyecto(uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.toastrSvc.success('Carpeta eliminado correctamente. 😀', 'Carpeta Eliminado');
              this.getAllCarpetas();
            });
        }
      });
  }

  // =====================> updateCarpeta
  public updateCarpeta(carpetaProyecto: CarpetaProyecto): void {

    const dialogRef = this.dialog.open(EditCarpetaComponent, { data: carpetaProyecto });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllCarpetas();
        }
      });
  }


  // =====================> getAllDocumentos
  private getAllDocumentos(): void {
    this.documentosSvc
      .getAllDocumentoProyectoByUuid(this.uuidProyecto, 'root')
      .pipe(takeUntil(this.destroy$))
      .subscribe((documentos: DocumentoProyecto[]) => {
        this.documentos = documentos;
      })
  }

  // =====================> newDocumento
  public newDocumento(): void {

    const documento: DocumentoProyecto = {
      uuidProyecto: this.uuidProyecto,
      path: 'root'
    }
    const matOptions: MatDialogConfig = {
      data: documento,
      width: '600px',
      height: 'auto',
      maxWidth: '600px',
      minWidth: '200px'
    }
    const dialogRef = this.dialog.open(NewDocumentoComponent, matOptions);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllDocumentos();
      });
  }

  // =====================> deleteDocumento
  public deleteDocumento(uuid: string): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.documentosSvc.deleteDocumentoProyecto(uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.toastrSvc.success('Documento eliminado correctamente. 😀', 'Documento Eliminado');
              this.getAllDocumentos();
            });
        }
      });
  }
  // =====================> updateDocumento
  public updateDocumento(documentoProyecto: DocumentoProyecto): void {

    const dialogRef = this.dialog.open(EditDocumentoComponent, { data: documentoProyecto });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllDocumentos();
        }
      });
  }

  // =====================> downloadFile
  public downloadFile(documento: DocumentoProyecto): void {
    const link = document.createElement('a');
    link.setAttribute('href', `${this.API_URL}/api/file/${documento.keyName}`);
    link.setAttribute('download', documento.nombre);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  public infoDocumento(documentoProyecto: DocumentoProyecto): void {
    this.dialog.open(InfoDocumentoComponent, { data: documentoProyecto })
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
