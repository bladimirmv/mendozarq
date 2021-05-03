import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '@app/core/services/auth/usuario.service';
import { PresupuestosService } from '@app/core/services/mendozarq/presupuestos.service';
import { ClienteModalComponent } from '@app/modules/proyectos/components/cliente-modal/cliente-modal.component';
import { CapituloPresupuesto, PresupuestoObra, PresupuestoObraView } from '@app/shared/models/mendozarq/presupuestos.interface';
import { Usuario } from '@app/shared/models/usuario.interface';
import { PdfService } from '@services/pdf/pdf.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-presupuesto-obra',
  templateUrl: './presupuesto-obra.component.html',
  styleUrls: ['./presupuesto-obra.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PresupuestoObraComponent implements OnInit, OnDestroy {






  capitulos: CapituloPresupuesto[] = [];
  filterValueCapitulo: string;
  dataSourceCapitulo: MatTableDataSource<CapituloPresupuesto> = new MatTableDataSource();
  columnsToDisplay: Array<string> = ['numero', 'nombre', 'total', 'options'];
  expandedElement: CapituloPresupuesto | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  panelOpenState = false;











  public empty: boolean = false;

  public pdfResult: any;
  private uuidPresupuesto: string = '';
  private destroy$: Subject<any> = new Subject<any>();

  private presupuesto: PresupuestoObraView = {};
  public presupuestoForm: FormGroup;
  public selectedClientes: Usuario[] = [];
  private clientes: Usuario[] = [];

  constructor(
    private pdfSvc: PdfService,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private usuarioSvc: UsuarioService,
    private presupuestoObraSvc: PresupuestosService,
    private toastrSvc: ToastrService,
    private router: Router,
    private presupuestosSvc: PresupuestosService) {
  }







  public getTotalBruto(): number {
    return this.capitulos.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }


  public getTotalWithIVA(): number {
    return (this.getTotalBruto() * (this.presupuesto.iva / 100));
  }


  public getTotalPresupuesto(): number {
    return this.getTotalBruto() + this.getTotalWithIVA();
  }

  public numberWithCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  // =====================> applyFilterPersonal
  applyFilterCapitulo(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValueCapitulo = event
      : this.filterValueCapitulo = (event.target as HTMLInputElement).value;
    this.dataSourceCapitulo.filter = this.filterValueCapitulo.trim().toLowerCase();
    if (this.dataSourceCapitulo.paginator) {
      this.dataSourceCapitulo.paginator.firstPage();
    }
  }





















  ngOnInit(): void {
    this.uuidPresupuesto = this.activateRoute.snapshot.params.uuid;

    this.initForm();
    this.initDataClientes();
    this.getPresuspuesto();



    this.dataSourceCapitulo.data = [
      {
        creadoEn: new Date(),
        uuid: '123',
        numero: 1,
        nombre: 'aa',
        total: 900,
        uuidPresupuestoObra: '123'
      }, {
        creadoEn: new Date(),
        uuid: '123',
        numero: 1,
        nombre: 'capitulo 1',
        total: 100,
        uuidPresupuestoObra: '123'
      }
    ];

    this.capitulos = [
      {
        creadoEn: new Date(),
        uuid: '123',
        numero: 1,
        nombre: 'aa',
        total: 900,
        uuidPresupuestoObra: '123'
      }, {
        creadoEn: new Date(),
        uuid: '123',
        numero: 1,
        nombre: 'capitulo 1',
        total: 100,
        uuidPresupuestoObra: '123'
      }
    ]

    this.dataSourceCapitulo.paginator = this.paginator;
    this.dataSourceCapitulo.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ====================> getPresuspuesto
  private getPresuspuesto() {
    this.presupuestosSvc
      .getOnePresupuestoObra(this.uuidPresupuesto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((presupuesto: PresupuestoObraView) => {
        this.presupuesto = presupuesto;
        this.presupuesto.totalBruto = this.getTotalBruto();
        this.presupuesto.totalWithIVA = this.getTotalWithIVA();
        this.presupuesto.totalPresupuesto = this.getTotalPresupuesto();
        this.initForm();
        this.generatePdf();
      });
  }

  // ============> onInitForm
  private initForm(): void {
    this.presupuestoForm = this.fb.group({
      nombre: [this.presupuesto.nombre, [Validators.required, Validators.maxLength(50), Validators.pattern(/^[0-9a-z\s]+$/)]],
      descripcion: [this.presupuesto.descripcion, [Validators.required, Validators.maxLength(200)]],
      iva: [this.presupuesto.iva, [Validators.required]],
      uuidCliente: [this.presupuesto.uuidCliente, Validators.required]
    });
  }

  // ===================> initDataClientes
  private initDataClientes(): void {
    this.usuarioSvc.getAllUsuarios()
      .pipe(map((usuarios: Usuario[]) =>
        usuarios.filter((usuario: Usuario) => usuario.rol === 'cliente')
      ), takeUntil(this.destroy$))
      .subscribe((clientes: Usuario[]) => {
        if (!clientes.length) {
          const dialogRef = this.dialog.open(ClienteModalComponent);

          dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (res) {
                dialogRef.close();
                this.router.navigate(['admin/usuarios']);
              } else {
                dialogRef.close();
              }
            });
        }
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }

  // ===================> onUpdatePresupuesto
  public onUpdatePresupuesto(presupuestoObra: PresupuestoObra): void {
    presupuestoObra.uuid = this.presupuesto.uuid;

    this.presupuestoObraSvc.updatePresupuestoObra(presupuestoObra.uuid, presupuestoObra)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('El presupuesto se ha actualizado correctamente. 😀', 'Presupuesto Actualizado');
          this.getPresuspuesto();
        }
      });
  }


  public clearForm(): void {
    this.presupuestoForm.reset();
    this.empty = true;
  }
  public fillOutForm(): void {
    this.initForm();
    this.empty = false;
  }

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.presupuestoForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
  }

  // ===========> getString
  getString(num: number): string {
    return String(num);
  }

  formatLabel(value: number) {
    if (value >= 1) {
      return value + '';
    }
    return value;
  }

  // ============> filterCliente
  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.clientes.filter(cliente => {
      return cliente.nombre.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0
        || cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0;
    })
  }

  // ============> onKeySearch
  public onKey(value) {
    this.selectedClientes = this._filter(value);
  }

  public onBack(): void {
    this.router.navigate(['admin/presupuestos']);
  }

  // ============================================= PDF ======================================================

  // ====================> generatePdf
  private async generatePdf(): Promise<void> {
    let pdf: Array<any> = [];

    pdf = await this.pdfSvc.presupuesto(pdf, this.presupuesto);
    pdf = await this.pdfSvc.detallePresupuesto(pdf, this.presupuesto);


    const docDefinition = {
      content: pdf,
      watermark: { text: '©MENDOZARQ', color: '#FF6E00', opacity: 0.06, bold: true, italics: false, },
      info: {
        title: `Presupuesto - ${this.presupuesto.uuid}`,
        author: '©MENDOZARQ'
      },
      pageMargins: [60, 40, 40, 60],
      pageSize: 'letter',
      defaultStyle: {
        font: 'Roboto'
      },
      footer: (currentPage, pageCount) => {
        if (currentPage) {
          return {
            fontSize: 10,
            text: `Pagina ${currentPage} de ${pageCount}`,
            alignment: 'center',
            margin: [0, 20, 0, 0],
            color: '#425066'
          };
        }
      }
    };

    this.pdfResult = this.pdfSvc.createPdf(docDefinition);

    const pdfIframe = document.querySelector('#pdf-iframe') as HTMLIFrameElement;
    pdfIframe.src = await this.pdfSvc.getPdfDataUrl(this.pdfResult);
  }

  // ====================> downloadPdf
  public downloadPdf(): void {
    if (this.pdfResult) {
      this.pdfSvc.dowload(this.pdfResult, `Presupuesto(${this.presupuesto.uuid})`);
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
