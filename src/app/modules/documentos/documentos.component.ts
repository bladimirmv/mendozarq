import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';


import { CarpetaProyecto, DocumentoProyecto } from '@models/mendozarq/documentos.proyecto.interface';
import { DocumentosService } from '@services/mendozarq/documentos.service';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewCarpetaComponent } from './components/new-carpeta/new-carpeta.component';
import { ActivatedRoute } from '@angular/router';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { EditCarpetaComponent } from './components/edit-carpeta/edit-carpeta.component';
import { NewDocumentoComponent } from './components/new-documento/new-documento.component';
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
    if (event.target.id !== 'content' && event.target.id !== 'list') {
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
              this.toastrSvc.success('Carpeta eliminado. 😀', 'Carpeta Eliminado');
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
      .getAllDocumentoProyectoByUuid(this.uuidProyecto)
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
      .subscribe((res) => {
        if (res) {
          this.getAllDocumentos();
        }
      });
  }

  public deleteDocumento(uuid: string): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.documentosSvc.deleteDocumentoProyecto(uuid)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.toastrSvc.success('Carpeta eliminado. 😀', 'Carpeta Eliminado');
              this.getAllDocumentos();
            });
        }
      });
  }
}
