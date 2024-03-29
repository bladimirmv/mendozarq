import { PdfService } from '@services/pdf/pdf.service';
import { BrightnessService } from '@services/brightness.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewUserComponent } from './components/new-user/new-user.component';
import { map, takeUntil, take } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { Usuario } from '@app/shared/models/usuario.interface';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { DeleteModalComponent } from '@shared/components/delete-modal/delete-modal.component';

import { UsuarioService } from '@app/core/services/auth/usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Chart } from 'chart.js';
import { MatTabChangeEvent } from '@angular/material/tabs';

import * as moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  expandedElement: Usuario | null;
  selected: Usuario[] = [];
  selection = new SelectionModel<Usuario>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion',
    'activo',
    'nombre',
    'apellidos',
    'rol',
    'celular',
    'correo',
    'username',
    'direccion',
    'edit',
  ];
  public dataSource: MatTableDataSource<Usuario> =
    new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public usuarios$: Observable<Usuario[]>;
  public usuario: Usuario[];
  private queryParams: string = '';

  // **Graficas y Reportes
  public analiticas: Usuario[];
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
    private usuarioSvc: UsuarioService,
    private _route: Router,
    private _actRoute: ActivatedRoute,
    private _pdfSvc: PdfService
  ) {}

  // =====================> onInit
  ngOnInit(): void {
    moment().locale('es');
    this.getAllUsuarios();

    this.queryParams = this._actRoute.snapshot.queryParams?.s
      ? this._actRoute.snapshot.queryParams?.s
      : '';
    this.applyFilter(this.queryParams);

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

  // =====================> getAllUsuarios
  getAllUsuarios(): void {
    this.usuarioSvc
      .getAllUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataSource.data = res;
        this.usuario = res;
        this.analiticas = res;

        if (this.tabIndex === 1) {
          this.initChart();
        }

        this._actRoute.queryParams.subscribe(
          (params) =>
            (this.tabIndex = params.tab === 'graficas_reportes' ? 1 : 0)
        );
      });
    this.usuarios$ = this.usuarioSvc.getAllUsuarios();
  }

  // =====================> onAddUser
  onAddUser(): void {
    const dialogRef = this.dialog.open(NewUserComponent, {
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getAllUsuarios();
      });
  }

  // =====================> oneditUser
  oneditUser(user: Usuario): void {
    const dialogRef = this.dialog.open(EditUserComponent, { data: user });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllUsuarios();
      });
  }

  // =====================> ondeleteUser
  async ondeleteUser(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneUsuario()
            : this.deleteMoreThanOneUsuario();
        }
      });
  }

  // =====================> deleteOneUsuario
  deleteOneUsuario(): void {
    this.usuarioSvc
      .deleteUsuario(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usr) => {
        if (usr) {
          this.toastSvc.success(
            'Se ha eliminado correctamente',
            'Usuario Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllUsuarios();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOneUsuario
  deleteMoreThanOneUsuario(): void {
    this.selected.forEach((usuario, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.usuarioSvc
        .deleteUsuario(usuario.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            this.toastSvc.success(
              'Se han eliminado correctamente',
              'Usuarios Eliminados',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllUsuarios();
            this.clearCheckbox();
          }
        });
    });
  }

  // !important, this part is for table
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
  checkboxLabel(row?: Usuario): string {
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
      labels: ['Administradores', 'Arquitectos', 'Vendedores', 'Clientes'],
      datasets: [
        {
          label: 'Roles',
          data: [...this.getRoles()],
          backgroundColor: [
            '#ff6058',
            '#ffbd2d',
            '#33b5e5',
            '#2ac940',
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
            text: `Grafica de Barras de Usuarios (${this.fechaReporte.toUpperCase()})`,
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
            text: `Grafica de Rosquilla de Usuarios (${this.fechaReporte.toUpperCase()})`,
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
    this.analiticas = this.usuario;
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
        this.analiticas = this.usuario;
        this.fechaReporte = 'Todos';
        break;
      case 1:
        this.analiticas = this.usuario;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            new Date(usr.creadoEn).getFullYear() === new Date().getFullYear()
        );
        this.fechaReporte = `Año ${new Date().getFullYear().toString()}`;
        break;
      case 2:
        this.analiticas = this.usuario;
        this.analiticas = this.analiticas.filter(
          (usr) =>
            moment(usr.creadoEn).format('MM-YYYY') ===
            moment().format('MM-YYYY')
        );
        this.fechaReporte = `${moment(new Date()).format('MMMM [de] YYYY')}`;
        break;
      case 3:
        this.analiticas = this.usuario;
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
        this.analiticas = this.usuario;
        break;

      default:
        break;
    }

    this.initChart();
  }

  private getRoles(): Array<number> {
    let administradores = 0;
    let arquitectos = 0;
    let vendedores = 0;
    let clientes = 0;
    this.analiticas.forEach((usr) => {
      switch (usr.rol) {
        case 'administrador':
          administradores++;
          break;
        case 'arquitecto':
          arquitectos++;
          break;
        case 'vendedor':
          vendedores++;
          break;
        case 'cliente':
          clientes++;
          break;
        default:
          break;
      }
    });

    return [administradores, arquitectos, vendedores, clientes];
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
      'usuario',
      `Reporte de Usuarios (${this.fechaReporte})`
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
