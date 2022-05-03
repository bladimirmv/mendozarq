import { MatTabChangeEvent } from '@angular/material/tabs';
import { PdfService } from './../../core/services/pdf/pdf.service';
import { Chart } from 'chart.js';
import { warningDialog } from '@shared/components/warning-modal/warning-modal.component';
import { DeleteModalComponent } from '@shared/components/delete-modal/delete-modal.component';
import { WebsocketService } from '@services/sockets/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { EditVentaComponent } from './components/edit-venta/edit-venta.component';
import { ActivatedRoute, Router, Resolve } from '@angular/router';
import { NewVentaComponent } from './components/new-venta/new-venta.component';
import { MatDialog } from '@angular/material/dialog';
import { VentaService } from '@services/liraki/venta.service';
import { estado, VentaView } from '@models/liraki/venta.interface';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { map, takeUntil } from 'rxjs/operators';
import { WarningModalComponent } from '@app/shared/components/warning-modal/warning-modal.component';

import * as moment from 'moment';

@Component({
  selector: 'app-venta-producto',
  templateUrl: './venta-producto.component.html',
  styleUrls: ['./venta-producto.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class VentaProductoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  private ventas: VentaView[] = [];

  public expandedElement: VentaView | null;
  public filterValueVenta: string;
  public dataSourceVenta: MatTableDataSource<VentaView> =
    new MatTableDataSource();
  public selectedVenta: VentaView[] = [] as VentaView[];
  public selectionVenta = new SelectionModel<VentaView>(true, []);
  public columnsToDisplay: Array<string> = [
    'seleccion',
    'creadoEn',
    'numeroVenta',
    'estado',
    'cliente',
    'nitCiCex',
    'departamento',
    'tipoEnvio',
    'metodoDePago',
    'total',
    'options',
  ];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  panelOpenState = false;
  public stats = {
    pendientes: 0,
    confirmados: 0,
    paraRecoger: 0,
    enEnvio: 0,
    completados: 0,
  };

  // **Graficas y Reportes
  public analiticas: VentaView[];
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
    private _ventaSvc: VentaService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toastrSvc: ToastrService,
    private _wsService: WebsocketService,
    private _pdfSvc: PdfService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    moment().locale('es');

    this._wsService.emit('ws:ventas');

    this.initData();

    this.dataSourceVenta.paginator = this.paginator;
    this.dataSourceVenta.sort = this.sort;
    this.selectionVenta.changed
      .pipe(
        takeUntil(this.destroy$),
        map((a) => a.source)
      )
      .subscribe((data) => (this.selectedVenta = data.selected));
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initData(): void {
    this._wsService
      .listen('ws:ventas')
      .pipe(takeUntil(this.destroy$))
      .subscribe((ventas: VentaView[]) => {
        this.dataSourceVenta.data = ventas;
        this.ventas = ventas;

        ventas.forEach((v) => {
          switch (v.estado) {
            case 'pendiente':
              this.stats.pendientes++;
              break;
            case 'confirmado':
              this.stats.confirmados++;
              break;
            case 'para_recoger':
              this.stats.paraRecoger++;
              break;
            case 'en_envio':
              this.stats.enEnvio++;
              break;
            case 'completado':
              this.stats.completados++;
              break;
            default:
              break;
          }
        });
        this.analiticas = ventas;

        if (this.tabIndex === 1) {
          this.initChart();
        }

        this.route.queryParams.subscribe(
          (params) =>
            (this.tabIndex = params.tab === 'graficas_reportes' ? 1 : 0)
        );
      });
  }

  public addVenta(): void {
    const dialog = this.dialog.open(NewVentaComponent, {
      data: {
        vendedor: this.route.snapshot.data['usuario']?.uuid,
        tipoVenta: 'fisica',
      },
      disableClose: true,
      minWidth: '400px',
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            '😀 Se ha agregado correctamente',
            'Venta Realizado'
          );
          this.initData();
        }
      });
  }

  public updateVenta(currentVenta: VentaView): void {
    const dialog = this.dialog.open(EditVentaComponent, {
      data: currentVenta,
      disableClose: true,
      minWidth: '400px',
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            '😀 Se ha actualizado correctamente',
            'Venta Actualizado'
          );
        }
      });
  }

  public updateEstado(venta: VentaView, option: number): void {
    let estado: estado;
    switch (option) {
      case 1:
        estado = 'pendiente';
        break;
      case 2:
        estado = 'confirmado';
        break;
      case 3:
        estado = 'para_recoger';
        break;
      case 4:
        estado = 'en_envio';
        break;
      case 5:
        estado = 'completado';
        break;
      default:
        break;
    }
    const dialogRef = this.dialog.open(WarningModalComponent, {
      data: {
        btnPrimary: 'Continuar',
        title: 'Cambio de Estado',
        paragraph: 'Estas segur@ de continuar con el cambio de estado?',
      } as warningDialog,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          venta.estado = estado;
          this._ventaSvc.updateEstadoVenta(venta.uuid, venta).subscribe(() => {
            this.toastrSvc.success(
              '😀 Se ha actualizado correctamente',
              'Estado Actualizado'
            );
            this.initData();
          });
        }
      });
  }

  public deleteVenta(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selectedVenta.length === 1
            ? this.deleteOneVenta()
            : this.deleteMoreThanOneProducto();
        }
      });
  }

  private deleteOneVenta(): void {
    this._ventaSvc
      .deleteVenta(this.selectedVenta[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            'Se ha eliminado correctamente',
            'Venta Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.clearCheckbox();
        }
      });
  }

  private deleteMoreThanOneProducto(): void {
    this.selectedVenta.forEach((servicio, index) => {
      const isLast: boolean = index + 1 === this.selectedVenta.length;
      this._ventaSvc
        .deleteVenta(servicio.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res && isLast) {
            this.toastrSvc.success(
              'Se han eliminado correctamente',
              'Ventas Eliminados',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.clearCheckbox();
          }
        });
    });
  }

  // !important, this part is for table.
  // =====================> applyFilter
  applyFilterVenta(event: Event | string): void {
    typeof event === 'string'
      ? (this.filterValueVenta = event)
      : (this.filterValueVenta = (event.target as HTMLInputElement).value);
    this.dataSourceVenta.filter = this.filterValueVenta.trim().toLowerCase();
    if (this.dataSourceVenta.paginator) {
      this.dataSourceVenta.paginator.firstPage();
    }
  }
  // =====================>
  isAllSelectedVenta(): any {
    const numSelected = this.selectionVenta.selected.length;
    const numRows = this.dataSourceVenta.data.length;
    return numSelected === numRows;
  }
  // =====================>
  masterToggle(): void {
    this.isAllSelectedVenta()
      ? this.selectionVenta.clear()
      : this.dataSourceVenta.data.forEach((row) =>
          this.selectionVenta.select(row)
        );
  }
  // =====================>
  clearCheckbox(): void {
    this.selectionVenta.clear();
  }
  // =====================>
  checkboxLabel(row?: VentaView): string {
    if (!row) {
      return `${this.isAllSelectedVenta() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selectionVenta.isSelected(row) ? 'deselect' : 'select'
    } row ${row.uuid}`;
  }

  // **Graficas y reportes
  public onLoadTab(e: MatTabChangeEvent): void {
    switch (e.index) {
      case 1:
        this.initChart();
        this._router.navigate([], {
          queryParams: {
            tab: 'graficas_reportes',
          },
          queryParamsHandling: 'merge',
        });
        break;

      case 0:
        this._router.navigate([], {
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
      labels: ['Sin Completar', 'Completados'],
      datasets: [
        {
          label: 'Ventas',
          data: [...this.getRoles()],
          backgroundColor: ['#ff6058', '#2ac940', '#a481d5'],
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
            text: `Grafica de Barras de Ventas (${this.fechaReporte.toUpperCase()})`,
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
            text: `Grafica de Rosquilla de Ventas (${this.fechaReporte.toUpperCase()})`,
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
    this.analiticas = this.ventas;
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
        this.analiticas = this.ventas;
        this.fechaReporte = 'Todos';
        break;
      case 1:
        this.analiticas = this.ventas;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            new Date(usr.creadoEn).getFullYear() === new Date().getFullYear()
        );
        this.fechaReporte = `Año ${new Date().getFullYear().toString()}`;
        break;
      case 2:
        this.analiticas = this.ventas;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            moment(usr.creadoEn).format('MM-YYYY') ===
            moment().format('MM-YYYY')
        );
        this.fechaReporte = `${moment(new Date()).format('MMMM [de] YYYY')}`;
        break;
      case 3:
        this.analiticas = this.ventas;
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
        this.analiticas = this.ventas;
        break;

      default:
        break;
    }

    this.initChart();
  }

  private getRoles(): Array<number> {
    let sinCompletar = 0;
    let completados = 0;

    this.analiticas.forEach((a) => {
      if (a.estado === 'completado') {
        completados++;
      } else {
        sinCompletar++;
      }
    });

    return [sinCompletar, completados];
  }

  // ====================> generatePdf
  public async generatePdf(): Promise<void> {
    let pdf: Array<any> = [];
    pdf = await this._pdfSvc.reporte(
      pdf,
      this.analiticas,
      [
        this.bar_chart.toBase64Image('image/png', 1.0),
        this.doughnut_chart.toBase64Image('image/png', 1.0),
      ],
      'ventas',
      `Reporte de Ventas (${this.fechaReporte})`
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
        title: 'Reporte-Ventas',
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

  public async generatePdfVenta(venta: VentaView): Promise<void> {
    let pdf: Array<any> = [];

    // pdf = await this._pdfSvc.ventaCliente(pdf, venta);

    pdf = await this._pdfSvc.factura(pdf, venta);

    const docDefinition = {
      content: pdf,
      watermark: {
        text: '©LIRAKI',
        color: '#FF6E00',
        opacity: 0.06,
        bold: true,
        italics: false,
      },
      info: {
        title: 'VENTA',
        author: '©LIRAKI',
      },
      pageMargins: [60, 40, 40, 60],
      pageSize: 'letter',
      defaultStyle: {
        font: 'Roboto',
      },
    };

    const pdfResult = this._pdfSvc.createPdf(docDefinition);

    this._pdfSvc.open(pdfResult);
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
