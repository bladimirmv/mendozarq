import { UploadImagesComponent } from './components/upload-images/upload-images.component';
import { DeleteModalComponent } from './../../shared/components/delete-modal/delete-modal.component';
import { EditObservacionObraComponent } from './components/edit-observacion-obra/edit-observacion-obra.component';
import { ActivatedRoute } from '@angular/router';
import { NewObservacionObraComponent } from './components/new-observacion-obra/new-observacion-obra.component';
import { takeUntil } from 'rxjs/operators';
import { ObservacionObraService } from './../../core/services/mendozarq/observacion-obra.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ObservacionObra,
  ObservacionObraView,
} from './../../shared/models/mendozarq/observacion.obra.interface';
import { Subject } from 'rxjs';
import { PdfService } from '@services/pdf/pdf.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { VisitaProyectoService } from '@app/core/services/mendozarq/visita-proyecto.service';
import { VisitaProyecto } from '@app/shared/models/mendozarq/visita.proyecto.interface';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-observacion-obra',
  templateUrl: './observacion-obra.component.html',
  styleUrls: ['./observacion-obra.component.scss'],
})
export class ObservacionObraComponent implements OnInit, OnDestroy {
  public pdfResult: any;

  private uuidVisita: string = '';
  private destroy$ = new Subject<any>();
  public observacion: ObservacionObraView[] = [];
  private visita: VisitaProyecto = {};
  private showPDF: boolean = false;

  selected: ObservacionObra[] = [];
  selection = new SelectionModel<ObservacionObra>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion',
    'puntoDeInspeccion',
    'observacion',
    'levantamientoObservacion',
    'edit',
  ];

  dataSource: MatTableDataSource<ObservacionObra> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private pdfSvc: PdfService,
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private observacionSvc: ObservacionObraService,
    private _route: ActivatedRoute,
    private _visitaSvc: VisitaProyectoService
  ) {}

  ngOnInit(): void {
    this.uuidVisita = this._route.snapshot.parent.parent.params.uuid;
    this.getVisita();

    this.selection.changed
      .pipe(map((a) => a.source))
      .subscribe((data) => (this.selected = data.selected));
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private getAllObservacionObra(): void {
    this.observacionSvc
      .getObservacionObraByUuidVisita(this.uuidVisita)
      .subscribe((res) => {
        this.dataSource.data = res;
        this.observacion = res;
        this.showPDF = true;
        this.generatePdf();
      });
  }

  private getVisita(): void {
    this._visitaSvc.getOneVisitaProyecto(this.uuidVisita).subscribe((v) => {
      this.visita = v;
      this.getAllObservacionObra();
    });
  }

  // =====================> onAddObservacionObra
  onAddObservacionObra(): void {
    const dialogRef = this.dialog.open(NewObservacionObraComponent, {
      data: this.uuidVisita,
      width: '500px',
      maxWidth: '100%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllObservacionObra();
        }
      });
  }

  // =====================> oneditObservacionObra
  onUpdateObservacionObra(observacion: ObservacionObra): void {
    const dialogRef = this.dialog.open(EditObservacionObraComponent, {
      data: observacion,
      width: '500px',
      maxWidth: '100%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllObservacionObra();
        }
      });
  }

  // =====================> ondeleteObservacionObra
  async onDeleteObservacionObra(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteModalComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneObservacionObra()
            : this.deleteMoreThanOneObservacionObra();
        }
      });
  }

  // =====================> deleteOneObservacionObra
  deleteOneObservacionObra(): void {
    this.observacionSvc
      .deleteObservacionObra(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usr) => {
        if (usr) {
          this.toastSvc.success(
            'Se ha eliminado correctamente',
            'Observacion Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllObservacionObra();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOneObservacionObra
  deleteMoreThanOneObservacionObra(): void {
    this.selected.forEach((personal, index) => {
      this.observacionSvc
        .deleteObservacionObra(personal.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            this.toastSvc.success(
              'Se han eliminado correctamente',
              'Observacion Eliminado',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllObservacionObra();
            this.clearCheckbox();
          }
        });
    });
  }

  public fotoObservacionObra(observacion: ObservacionObraView): void {
    const dialogRef = this.dialog.open(UploadImagesComponent, {
      data: observacion,
      // width: '500px',
      // maxWidth: '100%',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getAllObservacionObra();
      });
  }

  // !important, this part is for table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? (this.filterValue = event)
      : (this.filterValue = (event.target as HTMLInputElement).value);

    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // =====================> isAllSelected
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  // =====================> masterToggle
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }

  // =====================> checkboxLabel
  checkboxLabel(row?: ObservacionObra): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.observacion
    }`;
  }

  // ====================> generatePdf
  private async generatePdf(): Promise<void> {
    this.pdfResult = undefined;
    let pdf: Array<any> = [];

    if (this.showPDF) {
      pdf = await this.pdfSvc.observacionObra(
        pdf,
        this.observacion,
        this.visita
      );
    }

    const docDefinition = {
      content: pdf,
      watermark: {
        text: '©MENDOZARQ',
        color: '#FF6E00',
        opacity: 0.06,
        bold: true,
        italics: false,
      },
      info: {
        title: `Observacion - ${''}`,
        author: '©MENDOZARQ',
      },
      pageMargins: [60, 40, 40, 60],
      pageSize: 'letter',
      defaultStyle: {
        font: 'Roboto',
      },
      footer: (currentPage, pageCount) => {
        if (currentPage) {
          return {
            fontSize: 10,
            text: `Pagina ${currentPage} de ${pageCount}`,
            alignment: 'center',
            margin: [0, 20, 0, 0],
            color: '#425066',
          };
        }
      },
    };

    this.pdfResult = this.pdfSvc.createPdf(docDefinition);

    // const pdfIframe = document.querySelector(
    //   '#pdf-iframe'
    // ) as HTMLIFrameElement;
    // pdfIframe.src = await this.pdfSvc.getPdfDataUrl(this.pdfResult);
  }

  // ====================> downloadPdf
  public downloadPdf(): void {
    if (this.pdfResult) {
      this.pdfSvc.dowload(this.pdfResult, `Observacion(${''})`);
    }
  }

  // ====================> openPdf
  public openPdf(): void {
    if (this.pdfResult) {
      this.pdfSvc.open(this.pdfResult);
    }
  }

  // ====================> printPdf
  public printPdf(): void {
    if (this.pdfResult) {
      this.pdfSvc.print(this.pdfResult);
    }
  }
}
