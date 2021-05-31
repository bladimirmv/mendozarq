import { EditCapituloComponent } from './../edit-capitulo/edit-capitulo.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '@app/core/services/auth/usuario.service';
import { PresupuestosService } from '@app/core/services/mendozarq/presupuestos.service';
import { ClienteModalComponent } from '@app/modules/proyectos/components/cliente-modal/cliente-modal.component';
import { CapituloPresupuesto, CapituloPresupuestoView, PresupuestoObra, PresupuestoObraView } from '@app/shared/models/mendozarq/presupuestos.interface';
import { Usuario } from '@app/shared/models/usuario.interface';
import { PdfService } from '@services/pdf/pdf.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NewCapituloComponent } from '../new-capitulo/new-capitulo.component';
import { NewDetalleCapituloComponent } from '../new-detalle-capitulo/new-detalle-capitulo.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { CapituloPresupuestoService } from '@app/core/services/mendozarq/capitulo-presupuesto.service';

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

  public panelOpenState = false;
  private capitulos: CapituloPresupuestoView[] = [];
  public filterValueCapitulo: string;
  public dataSourceCapitulo: MatTableDataSource<CapituloPresupuesto> = new MatTableDataSource();
  public columnsToDisplay: Array<string> = ['seleccion', 'numero', 'nombre', 'total', 'options'];
  public expandedElement: CapituloPresupuesto | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public empty: boolean = false;
  public pdfResult: any;
  private uuidPresupuesto: string = '';
  private destroy$: Subject<any> = new Subject<any>();

  public selectedCapitulo: CapituloPresupuesto[] = [];
  public selectionCapitulo = new SelectionModel<CapituloPresupuesto>(true, []);

  public presupuesto: PresupuestoObraView = {};
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
    private capituloPresupuestoSvc: CapituloPresupuestoService,
    private toastrSvc: ToastrService,
    private router: Router,
    private presupuestosSvc: PresupuestosService) {

  }

  ngOnInit(): void {
    this.uuidPresupuesto = this.activateRoute.snapshot.params.uuid;

    this.initForm();
    this.initData();

    this.dataSourceCapitulo.paginator = this.paginator;
    this.dataSourceCapitulo.sort = this.sort;


    this.selectionCapitulo.changed
      .pipe(takeUntil(this.destroy$),
        map(a => a.source))
      .subscribe(data => this.selectedCapitulo = data.selected);
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  private initData() {
    this.initDataClientes();
    this.getPresuspuesto();
    this.getCapituloPresupuesto();
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

  // ? presupuesto
  // ====================>
  private getPresuspuesto(generatePDF?: boolean): void {
    this.presupuestosSvc
      .getOnePresupuestoObra(this.uuidPresupuesto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((presupuesto: PresupuestoObraView) => {
        this.presupuesto = presupuesto;
        this.presupuesto.totalBruto = this.getTotalBruto();
        this.presupuesto.totalWithIVA = this.getTotalWithIVA();
        this.presupuesto.totalPresupuesto = this.getTotalPresupuesto();
        this.initForm();
        if (generatePDF) this.generatePdf();
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
          this.getPresuspuesto(true);
        }
      });
  }


  // ? capitulo
  // ====================>
  private getCapituloPresupuesto(generatePDF?: boolean): void {
    this.capituloPresupuestoSvc.getAllCapituloPresupuesto(this.uuidPresupuesto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((capitulos: CapituloPresupuestoView[]) => {
        this.dataSourceCapitulo.data = capitulos;
        this.capitulos = capitulos;
        if (this.generatePdf) this.generatePdf();
      });
  }

  // ===================> onAddCapitulo
  public onAddCapitulo(): void {
    const dialogRef = this.dialog.open(NewCapituloComponent, {
      data: this.uuidPresupuesto
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) this.getCapituloPresupuesto(true);
      });
  }

  public onUpdateCapitulo(capituloPresupuesto: CapituloPresupuesto): void {
    const dialogRef = this.dialog.open(EditCapituloComponent, {
      data: capituloPresupuesto
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) this.getCapituloPresupuesto();
      });
  }


  // ===================>
  public onDeleteCapitulo(capitulo: CapituloPresupuesto): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selectedCapitulo.length === 1
            ? this.deleteOneCapitulo()
            : this.deleteMoreThanOneCapitulo();
        }
      });
  }

  private deleteOneCapitulo(): void {
    this.capituloPresupuestoSvc.deleteCapituloPresupuesto(this.selectedCapitulo[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getCapituloPresupuesto();
        this.clearCheckbox();
        this.toastrSvc.success('Se ha eliminado correctamente 😀', 'Capitulo Eliminado', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing'
        })
      });
  }

  private deleteMoreThanOneCapitulo(): void {
    this.selectedCapitulo.forEach((capitulo, index) => {
      const isLast: boolean = index + 1 === this.selectedCapitulo.length;
      this.capituloPresupuestoSvc
        .deleteCapituloPresupuesto(capitulo.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastrSvc.success('Se han eliminado correctamente 😀', 'Capitulos Eliminados', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getCapituloPresupuesto()
            this.clearCheckbox();
          }
        });
    });
  }



  // ? detalle capitulo
  // ===================>
  public onAddDettalleCapitulo(): void {
    const dialogRef = this.dialog.open(NewDetalleCapituloComponent);
  }

  // ===================>
  public onDeleteDetalleCapitulo(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        res
          ? this.deleteDetalleCapitulo()
          : null;
      });
  }

  private deleteDetalleCapitulo(): void {

  }


  // !core funtions
  // ===================> clearForm
  public clearForm(): void {
    this.presupuestoForm.reset();
    this.empty = true;
  }

  // =====================>
  public fillOutForm(): void {
    this.initForm();
    this.empty = false;
  }

  // =====================>
  public getTotalBruto(): number {
    return this.capitulos.map(t => t.total).reduce((acc, value) => acc + value, 0);
  }

  // =====================>
  public getTotalWithIVA(): number {
    return (this.getTotalBruto() * (this.presupuesto.iva / 100));
  }

  // =====================>
  public getTotalPresupuesto(): number {
    return this.getTotalBruto() + this.getTotalWithIVA();
  }

  // =====================>
  public numberWithCommas(x: number): string {
    console.log(x)
    return (x != 0)
      ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : '0';
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

  // ===========> isValidField
  public isValidField(field: string): { color?: string; status?: boolean; icon?: string; } {
    const validateFIeld = this.presupuestoForm.get(field);
    return (!validateFIeld.valid && validateFIeld.touched)
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
        ? { color: 'accent', status: true, icon: 'done' }
        : {};
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




  // !important, this part is for table.
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
  // =====================>
  isAllSelectedCapitulos(): any {
    const numSelected = this.selectionCapitulo.selected.length;
    const numRows = this.dataSourceCapitulo.data.length;
    return numSelected === numRows;
  }
  // =====================>
  masterToggle(): void {
    this.isAllSelectedCapitulos() ?
      this.selectionCapitulo.clear() :
      this.dataSourceCapitulo.data.forEach(row => this.selectionCapitulo.select(row));
  }
  // =====================>
  clearCheckbox(): void {
    this.selectionCapitulo.clear();
  }
  // =====================>
  checkboxLabel(row?: CapituloPresupuesto): string {
    if (!row) {
      return `${this.isAllSelectedCapitulos() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionCapitulo.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }




  // ============================================= PDF ======================================================

  // ====================> generatePdf
  private async generatePdf(): Promise<void> {
    let pdf: Array<any> = [];

    pdf = await this.pdfSvc.presupuesto(pdf, this.presupuesto, this.capitulos);
    pdf = await this.pdfSvc.detallePresupuesto(pdf, this.presupuesto, this.capitulos);

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
