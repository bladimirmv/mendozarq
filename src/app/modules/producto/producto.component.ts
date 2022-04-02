import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { PdfService } from '@services/pdf/pdf.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

import { ProductoService } from '@services/liraki/producto.service';
import {
  FotoProducto,
  Producto,
  ProductoView,
} from '@models/liraki/producto.interface';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, takeUntil } from 'rxjs/operators';
import { NewProductoComponent } from './components/new-producto/new-producto.component';
import { EditProductoComponent } from './components/edit-producto/edit-producto.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { CategoriaProducto } from '@app/shared/models/liraki/categoria.producto.interface';
import { environment } from '@env/environment';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ImgPreviewComponent } from '@app/shared/components/img-preview/img-preview.component';

import * as moment from 'moment';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
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
export class ProductoComponent implements OnInit, OnDestroy {
  private API_URL = environment.API_URL;

  private destroy$: Subject<any> = new Subject<any>();
  public activos: number = 0;
  public inactivos: number = 0;
  public productos: Array<Producto> = [];
  selected: Producto[] = [];
  selection = new SelectionModel<Producto>(true, []);
  filterValue: string;
  public columns: Array<string> = [
    'seleccion',
    'estado',
    'nombre',
    'precio',
    'stock',
    'categorias',
    'descripcion',
    'barcode',
    'edit',
  ];
  expandedElement: ProductoView | null;
  public source: MatTableDataSource<Producto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // pdfResult: any;

  // **Graficas y Reportes
  public pdfResultQR: any;
  public analiticas: Array<Producto>;
  public reporteOption: number = 0;
  public bar_chart: Chart;
  public doughnut_chart: Chart;
  public pdfResult: any;
  public tabIndex: number = 0;
  public loadIframe = false;
  public rangeFirst: Date = new Date();
  public rangeSecond: Date = new Date();
  private fechaReporte: string = 'Todos';
  private queryParams: string = '';

  constructor(
    private productoSvc: ProductoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService,
    private _route: Router,
    private _actRoute: ActivatedRoute,
    private _pdfSvc: PdfService
  ) {}

  ngOnInit(): void {
    moment().locale('es');
    this.queryParams = this._actRoute.snapshot.queryParams?.s
      ? this._actRoute.snapshot.queryParams?.s
      : '';
    this.applyFilter(this.queryParams);

    this.getAllProducto();

    this.source.paginator = this.paginator;
    this.source.sort = this.sort;

    this.selection.changed
      .pipe(map((a) => a.source))
      .subscribe((data) => (this.selected = data.selected));
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private async generatePdfQr(uuid: string): Promise<void> {
    const docDefinition = {
      pageSize: {
        width: 68,
        height: 68,
      },
      pageMargins: [5, 5, 5, 5],
      content: [
        {
          qr: uuid ? uuid : 'sin uuid',
          background: '#FFFFFF',
          fit: '70',
        },
      ],
    };

    this.pdfResultQR = this._pdfSvc.createPdf(docDefinition);
    this._pdfSvc.open(this.pdfResultQR);
  }

  dowloadBarcode(producto: Producto): void {
    this.generatePdfQr(producto.uuid);
  }

  private getAllProducto(): void {
    this.productoSvc
      .getAllProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productos: Producto[]) => {
        this.source.data = productos;
        this.productos = productos;
        this.activos = 0;
        this.inactivos = 0;
        productos.filter((prod) => {
          this.activos += prod.estado ? 1 : 0;
          this.inactivos += prod.estado ? 0 : 1;
        });

        this.analiticas = productos;

        if (this.tabIndex === 1) {
          this.initChart();
        }

        this._actRoute.queryParams.subscribe(
          (params) =>
            (this.tabIndex = params.tab === 'graficas_reportes' ? 1 : 0)
        );
      });
  }

  public addProducto(): void {
    const dialogRef = this.dialog.open(NewProductoComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        // if (res === true) {
        this.getAllProducto();
        // }
      });
  }

  public editProducto(producto: Producto): void {
    const dialogRef = this.dialog.open(EditProductoComponent, {
      data: producto,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        this.getAllProducto();
      });
  }

  public deleteProducto(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneProducto()
            : this.deleteMoreThanOneProducto();
        }
      });
  }

  private deleteOneProducto(): void {
    this.productoSvc
      .deleteProducto(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            'Se ha eliminado correctamente',
            'Producto Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllProducto();
          this.clearCheckbox();
        }
      });
  }

  private deleteMoreThanOneProducto(): void {
    this.selected.forEach((servicio, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.productoSvc
        .deleteProducto(servicio.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res && isLast) {
            this.toastrSvc.success(
              'Se han eliminado correctamente',
              'Productos Eliminados',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllProducto();
            this.clearCheckbox();
          }
        });
    });
  }

  // =====================> downloadFile
  public downloadFile(foto: FotoProducto): void {
    const link = document.createElement('a');
    link.setAttribute('href', `${this.API_URL}/api/file/${foto.keyName}`);
    link.setAttribute('download', foto.keyName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  public modalPreview(fotos: FotoProducto[], foto: FotoProducto): void {
    const keyNames: Array<string> = fotos.map(
      (foto: FotoProducto) => `${this.API_URL}/api/file/${foto.keyName}`
    );
    this.dialog.open(ImgPreviewComponent, {
      data: {
        fotos: keyNames,
        current: keyNames.indexOf(`${this.API_URL}/api/file/${foto.keyName}`),
      },
      panelClass: 'custom-dialog-container',
    });
  }

  public commaText(text: CategoriaProducto[]): string {
    let result: string = '';
    text.forEach((categroria: CategoriaProducto, index: number) => {
      result += categroria.nombre;
      result += index === text.length - 1 ? '.' : ', ';
    });
    return result;
  }

  public getImage(keyName: string): string {
    return `${this.API_URL}/api/file/${keyName}`;
  }

  // !important, this part is for producto table.
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

    this.source.filter = this.filterValue.trim().toLowerCase();
    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }
  // =====================> isAllSelected
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.source.data.length;
    return numSelected === numRows;
  }
  // =====================> masterToggle
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.source.data.forEach((row) => this.selection.select(row));
  }
  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }
  // =====================> checkboxLabel
  checkboxLabel(row?: Producto): string {
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
      labels: ['En Stock', 'Agotado'],
      datasets: [
        {
          label: 'Roles',
          data: [...this.getDataGraficas()],
          backgroundColor: [
            '#2ac940',
            '#ff6058',
            '#ffbd2d',
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
    this.analiticas = this.productos;
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
        this.analiticas = this.productos;
        this.fechaReporte = 'Todos';
        break;
      case 1:
        this.analiticas = this.productos;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            new Date(usr.creadoEn).getFullYear() === new Date().getFullYear()
        );
        this.fechaReporte = `Año ${new Date().getFullYear().toString()}`;
        break;
      case 2:
        this.analiticas = this.productos;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            moment(usr.creadoEn).format('MM-YYYY') ===
            moment().format('MM-YYYY')
        );
        this.fechaReporte = `${moment(new Date()).format('MMMM [de] YYYY')}`;
        break;
      case 3:
        this.analiticas = this.productos;
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
        this.analiticas = this.productos;
        break;

      default:
        break;
    }

    this.initChart();
  }

  private getDataGraficas(): Array<number> {
    let activos: number = 0;
    let inactivos: number = 0;
    let stock: number = 0;
    let sinStock: number = 0;

    this.analiticas.forEach((data) => {
      data.stock > 0 ? stock++ : sinStock++;
    });

    return [stock, sinStock];
  }

  // ====================> generatePdf
  public async generatePdf(): Promise<void> {
    let pdf: Array<any> = [];
    pdf = await this._pdfSvc.reporte<Producto>(
      pdf,
      this.analiticas,
      [
        this.bar_chart.toBase64Image('image/png', 1.0),
        this.doughnut_chart.toBase64Image('image/png', 1.0),
      ],
      'producto',
      `Reporte de Productos (${this.fechaReporte})`
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
        title: 'Reporte-Usuarios',
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
