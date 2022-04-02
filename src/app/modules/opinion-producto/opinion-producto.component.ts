import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from '@services/pdf/pdf.service';
import { Chart } from 'chart.js';
import { EditOpinionComponent } from './components/edit-opinion/edit-opinion.component';
import { OpinionProductoService } from '@services/liraki/opinion-producto.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DeleteModalComponent } from '@shared/components/delete-modal/delete-modal.component';
import { OpinionProductoView } from '@app/shared/models/liraki/opinion.producto.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-opinion-producto',
  templateUrl: './opinion-producto.component.html',
  styleUrls: ['./opinion-producto.component.scss'],
})
export class OpinionProductoComponent implements OnInit {
  private destroy$ = new Subject<any>();
  public opiniones: OpinionProductoView[];

  selected: OpinionProductoView[] = [];
  selection = new SelectionModel<OpinionProductoView>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion',
    'estado',
    'creadoEn',
    'cliente',
    'puntuacion',
    'nombreProducto',
    'verificado',
    'titulo',
    'descripcion',
    'edit',
  ];

  dataSource: MatTableDataSource<OpinionProductoView> =
    new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public estados = {
    activos: 0,
    inactivos: 0,
  };

  // **Graficas y Reportes
  public analiticas: OpinionProductoView[];
  public reporteOption: number = 0;
  public bar_chart: Chart;
  public doughnut_chart: Chart;
  public pdfResult: any;
  public tabIndex: number = 0;
  public loadIframe = false;
  public rangeFirst: Date = new Date();
  public rangeSecond: Date = new Date();
  private fechaReporte: string = 'Todos';

  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private _opinionSvc: OpinionProductoService,
    private _actRoute: ActivatedRoute,
    private _route: Router,
    private _pdfSvc: PdfService
  ) {}

  // =====================> onInit
  ngOnInit(): void {
    this.getAllOpiniones();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map((a) => a.source))
      .subscribe((data) => (this.selected = data.selected));
  }
  // =====================> onDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // =====================> getAll
  private getAllOpiniones(): void {
    this._opinionSvc
      .getAllOpinion()
      .subscribe((opiniones: OpinionProductoView[]) => {
        this.dataSource.data = opiniones;
        this.opiniones = opiniones;
        this.analiticas = opiniones;

        if (this.tabIndex === 1) {
          this.initChart();
        }

        this._actRoute.queryParams.subscribe(
          (params) =>
            (this.tabIndex = params.tab === 'graficas_reportes' ? 1 : 0)
        );

        this.estados.activos = opiniones.filter((op) => op.estado).length;
        this.estados.inactivos = opiniones.filter((op) => !op.estado).length;
      });
  }

  public updateOpinion(opinion: OpinionProductoView): void {
    const dialogRef = this.dialog.open(EditOpinionComponent, {
      data: opinion,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllOpiniones();
        }
      });
  }

  // =====================> ondelete
  public onDelete(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneOpinion()
            : this.deleteMoreThanOneOpinion();
        }
      });
  }

  // =====================> deleteOne
  private deleteOneOpinion(): void {
    this._opinionSvc
      .deleteOpinion(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usr) => {
        if (usr) {
          this.toastSvc.success(
            '😀 Se ha eliminado correctamente',
            'Opinion Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllOpiniones();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOne
  private deleteMoreThanOneOpinion(): void {
    this.selected.forEach((personal, index) => {
      this._opinionSvc
        .deleteOpinion(personal.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            this.toastSvc.success(
              '😀 Se han eliminado correctamente',
              'Opiniones Eliminados',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllOpiniones();
            this.clearCheckbox();
          }
        });
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
  checkboxLabel(row?: OpinionProductoView): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.uuid
    }`;
  }

  // **Graficas y reportes
  public onLoadTab(e: MatTabChangeEvent): void {
    switch (e.index) {
      case 1:
        this.initChart();
        this._route.navigate([], {
          queryParams: {
            tab: 'graficas_reportes',
          },
          queryParamsHandling: 'merge',
        });
        break;

      case 0:
        this._route.navigate([], {
          queryParams: {
            tab: 'tabla',
          },
          queryParamsHandling: 'merge',
        });
        break;

      default:
        break;
    }
  }

  public async initChart(): Promise<void> {
    const data = {
      labels: [
        '1 Estrella',
        '2 Estrellas',
        '3 Estrellas',
        '4 Estrellas',
        '5 Estrellas',
      ],
      datasets: [
        {
          label: 'Calificaciones',
          data: [...this.getDataGraficas()],
          backgroundColor: [
            '#ff6058',
            '#ffbd2d',
            '#33b5e5',
            '#2ac940',
            '#a481d5',
            '#a481d5',
          ],
        },
      ],
    };

    const options = {
      color: '#a5a5a5',
      plugins: {
        legend: {
          labels: {
            color: '#a5a5a5',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#a5a5a5',
            borderColor: '#a5a5a5',
          },
          ticks: {
            color: '#a5a5a5',
          },
        },
        x: {
          grid: {
            color: '#a5a5a5',
            borderColor: '#a5a5a5',
          },
          ticks: {
            color: '#a5a5a5',
          },
        },
      },
      responsive: true,
    };

    if (this.bar_chart) {
      this.bar_chart.destroy();
    }
    if (this.doughnut_chart) {
      this.doughnut_chart.destroy();
    }

    this.bar_chart = new Chart('bar', {
      type: 'bar',
      data,
      options: {
        ...options,
        plugins: {
          title: {
            color: '#ff6e00',
            display: true,
            text: `Grafica de Barras de Calificaciones de Productos (${this.fechaReporte.toUpperCase()})`,
            font: {
              size: 16,
              family: 'Montserrat',
            },
          },
        },
      },
    });

    this.doughnut_chart = new Chart('doughnut', {
      type: 'doughnut',

      data,
      options: {
        ...options,
        plugins: {
          title: {
            color: '#ff6e00',
            display: true,
            text: `Grafica de Rosquilla de Calificaciones de Productos (${this.fechaReporte.toUpperCase()})`,
            font: {
              size: 16,
              family: 'Montserrat',
            },
          },
        },
      },
    });
    this.loadIframe = false;
    await this.addDelay(1);
    this.loadIframe = true;
    await this.generatePdf();
  }

  private addDelay(s: number): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, s * 1000));
  }

  public filterRangeDate(): void {
    this.analiticas = this.opiniones;
    this.analiticas = this.analiticas.filter((usr) =>
      moment(usr.creadoEn).isBetween(this.rangeFirst, this.rangeSecond)
    );

    this.fechaReporte = `${moment(this.rangeFirst).format(
      'DD/MM/YYYY'
    )}  - ${moment(this.rangeSecond).format('DD/MM/YYYY')}`;
    this.initChart();
  }

  public filterGraficasReportes(): void {
    switch (this.reporteOption) {
      case 0:
        this.analiticas = this.opiniones;
        this.fechaReporte = 'Todos';
        break;
      case 1:
        this.analiticas = this.opiniones;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            new Date(usr.creadoEn).getFullYear() === new Date().getFullYear()
        );
        this.fechaReporte = `Año ${new Date().getFullYear().toString()}`;
        break;
      case 2:
        this.analiticas = this.opiniones;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            moment(usr.creadoEn).format('MM-YYYY') ===
            moment().format('MM-YYYY')
        );
        this.fechaReporte = `${moment(new Date()).format('MMMM [de] YYYY')}`;
        break;
      case 3:
        this.analiticas = this.opiniones;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            moment(usr.creadoEn).format('DD-MM-YYYY') ===
            moment().format('DD-MM-YYYY')
        );
        this.fechaReporte = `${moment(new Date()).format(
          'DD [de] MMMM [del] YYYY'
        )}`;
        break;

      case 4:
        this.analiticas = this.opiniones;
        break;

      default:
        break;
    }

    this.initChart();
  }

  private getDataGraficas(): Array<number> {
    let puntuacion: Array<number> = [0, 0, 0, 0, 0];

    this.analiticas.forEach((op) => {
      switch (op.puntuacion) {
        case 1:
          puntuacion[0]++;
          break;
        case 2:
          puntuacion[1]++;
          break;
        case 3:
          puntuacion[2]++;
          break;
        case 4:
          puntuacion[3]++;
          break;
        case 5:
          puntuacion[4]++;
          break;
        default:
          break;
      }
    });

    return puntuacion;
  }

  // ====================> generatePdf
  public async generatePdf(): Promise<void> {
    let pdf: Array<any> = [];
    const img: HTMLCanvasElement = document.querySelector('#bar');
    pdf = await this._pdfSvc.reporte(
      pdf,
      this.analiticas,
      [
        this.bar_chart.toBase64Image('image/png', 1.0),
        this.doughnut_chart.toBase64Image('image/png', 1.0),
      ],
      'opiniones',
      `Reporte de Calificaciones de Productos (${this.fechaReporte})`
    );

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
        title: 'Reporte-Calificaciones',
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

    this.pdfResult = this._pdfSvc.createPdf(docDefinition);

    const pdfIframe = document.querySelector(
      '#pdf-iframe'
    ) as HTMLIFrameElement;
    pdfIframe.src = await this._pdfSvc.getPdfDataUrl(this.pdfResult);
  }

  // ====================> downloadPdf
  public downloadPdf(): void {
    if (this.pdfResult) {
      this._pdfSvc.dowload(this.pdfResult, 'Reporte-Usuarios');
    }
  }

  // ====================> openPdf
  public openPdf(): void {
    if (this.pdfResult) {
      this._pdfSvc.open(this.pdfResult);
    }
  }

  // ====================> printPdf
  public printPdf(): void {
    if (this.pdfResult) {
      this._pdfSvc.print(this.pdfResult);
    }
  }
}
