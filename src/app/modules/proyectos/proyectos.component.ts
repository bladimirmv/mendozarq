import { ProyectoView } from './../../shared/models/mendozarq/proyecto.interface';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Chart } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from './../../core/services/pdf/pdf.service';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';

import { NewProyectoComponent } from './components/new-proyecto/new-proyecto.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { EditProyectoComponent } from '@modules/proyectos/components/edit-proyecto/edit-proyecto.component';
import { Proyecto } from '@models/mendozarq/proyecto.interface';
import { Usuario } from '@models/usuario.interface';

import * as moment from 'moment';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss'],
})
export class ProyectosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  public proyectos: Array<ProyectoView> = [];

  selected: Proyecto[] = [];
  selection = new SelectionModel<Proyecto>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion',
    'estado',
    'nombre',
    'porcentaje',
    'cliente',
    'categoria',
    'fechaInicio',
    'fechaFinal',
    'lugarProyecto',
    'descripcion',
    'edit',
  ];

  dataSource: MatTableDataSource<Proyecto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public proyecto: ProyectoView[];
  public $cliente: Observable<Usuario>;

  // **Graficas y Reportes
  public analiticas: ProyectoView[];
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
    private proyectoSvc: ProyectoService,
    private _route: Router,
    private _actRoute: ActivatedRoute,
    private _pdfSvc: PdfService
  ) {}

  // =====================> onInit
  ngOnInit(): void {
    moment().locale('es');

    this.getAllProyecto();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(
        map((a) => a.source),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => (this.selected = data.selected));
  }
  // =====================> onDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    // this.locationBarSvc.popLocation();
  }

  // =====================> getAllProyecto
  getAllProyecto(): void {
    this.proyectoSvc
      .getAllProyecto()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataSource.data = res;
        this.proyecto = res;
        this.proyectos = res;
        this.analiticas = res;

        if (this.tabIndex === 1) {
          this.initChart();
        }

        this._actRoute.queryParams.subscribe((params) => {
          switch (params.tab) {
            case 'graficas_reportes':
              this.tabIndex = 1;
              break;

            // case 'mapa':
            //   this.tabIndex = 2;
            //   break;

            case 'tabla':
              this.tabIndex = 0;
              break;

            default:
              break;
          }
          // this.tabIndex = params.tab === 'graficas_reportes' ? 1 : 0;
        });
      });
  }

  // =====================> onAddProyecto
  onAddProyecto(): void {
    const dialogRef = this.dialog.open(NewProyectoComponent, {
      // width: '100%',
      // maxWidth: '700px',
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllProyecto();
      });
  }

  // =====================> onUpdateProyecto
  onUpdateProyecto(proyecto: Proyecto): void {
    const dialogRef = this.dialog.open(EditProyectoComponent, {
      data: proyecto,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllProyecto();
      });
  }

  // =====================> onDeleteProyecto
  async onDeleteProyecto(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneProyecto()
            : this.deleteMoreThanOneProyecto();
        }
      });
  }

  // =====================> deleteOneProyecto
  deleteOneProyecto(): void {
    this.proyectoSvc
      .deleteProyecto(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usr) => {
        if (usr) {
          this.toastSvc.success(
            'Se ha eliminado correctamente',
            'Proyecto Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllProyecto();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOneProyecto
  deleteMoreThanOneProyecto(): void {
    this.selected.forEach((proyecto, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.proyectoSvc
        .deleteProyecto(proyecto.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res && isLast) {
            this.toastSvc.success(
              'Se han eliminado correctamente',
              'Proyecto Eliminado',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllProyecto();
            this.clearCheckbox();
          }
        });
    });
  }

  // !important, this part is for table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {
    if (event) {
      this._route.navigate([], {
        queryParams: {
          s:
            typeof event === 'string'
              ? event
              : (event.target as HTMLInputElement).value,
        },
        queryParamsHandling: 'merge',
      });
    }
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
  checkboxLabel(row?: Proyecto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.nombre
    }`;
  }

  // **Graficas y reportes
  public onLoadTab(e: MatTabChangeEvent): void {
    switch (e.index) {
      // case 2:
      //   this._route.navigate([], {
      //     queryParams: {
      //       tab: 'mapa',
      //     },
      //     queryParamsHandling: 'merge',
      //   });
      //   break;

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
      labels: ['Completados', 'En Curso'],
      datasets: [
        {
          label: 'Proyectos',
          data: [...this.getDataGraficas()],
          backgroundColor: [
            '#2ac940',
            '#ffbd2d',
            '#ff6058',
            '#33b5e5',
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
            text: `Grafica de Barras de Proyectos (${this.fechaReporte.toUpperCase()})`,
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
            text: `Grafica de Rosquilla de Proyectos (${this.fechaReporte.toUpperCase()})`,
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
    this.analiticas = this.proyecto;
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
        this.analiticas = this.proyecto;
        this.fechaReporte = 'Todos';
        break;
      case 1:
        this.analiticas = this.proyecto;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            new Date(usr.creadoEn).getFullYear() === new Date().getFullYear()
        );
        this.fechaReporte = `Año ${new Date().getFullYear().toString()}`;
        break;
      case 2:
        this.analiticas = this.proyecto;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            moment(usr.creadoEn).format('MM-YYYY') ===
            moment().format('MM-YYYY')
        );
        this.fechaReporte = `${moment(new Date()).format('MMMM [de] YYYY')}`;
        break;
      case 3:
        this.analiticas = this.proyecto;
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
        this.analiticas = this.proyecto;
        break;

      default:
        break;
    }

    this.initChart();
  }

  private getDataGraficas(): Array<number> {
    let completados: number = 0;
    let enCurso: number = 0;

    this.analiticas.forEach((data) => {
      data.porcentaje === 100 ? completados++ : enCurso++;
    });

    return [completados, enCurso];
  }

  // ====================> generatePdf
  public async generatePdf(): Promise<void> {
    let pdf: Array<any> = [];
    pdf = await this._pdfSvc.reporte<ProyectoView>(
      pdf,
      this.analiticas,
      [
        this.bar_chart.toBase64Image('image/png', 1.0),
        this.doughnut_chart.toBase64Image('image/png', 1.0),
      ],
      'proyecto',
      `Reporte de Proyectos (${this.fechaReporte})`
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
        title: 'Reporte-Proyectos',
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
