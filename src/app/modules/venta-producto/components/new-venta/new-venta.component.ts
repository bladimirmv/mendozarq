import { VentaService } from '@services/liraki/venta.service';
import {
  ConceptoVentaView,
  tipoVenta,
  VentaProducto,
} from '@models/liraki/venta.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { environment } from '@env/environment.prod';
import { Producto, ProductoView } from '@models/liraki/producto.interface';
import { ProductoService } from '@services/liraki/producto.service';
import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil, startWith } from 'rxjs/operators';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

import { UsuarioService } from '@services/auth/usuario.service';
import { Usuario } from '@app/shared/models/usuario.interface';
import { ClienteModalComponent } from '@app/modules/proyectos/components/cliente-modal/cliente-modal.component';

@Component({
  selector: 'app-new-venta',
  templateUrl: './new-venta.component.html',
  styleUrls: ['./new-venta.component.scss'],
})
export class NewVentaComponent implements OnInit, OnDestroy {
  private API_URL = environment.API_URL;
  private destroy$ = new Subject<any>();
  public continuar: boolean = true;

  public ventaForm: FormGroup;
  private clientes: Usuario[] = [];
  public selectedClientes: Usuario[] = [];
  public searchCliente: FormControl = new FormControl();

  public conceptoVentaForm: FormGroup;
  public productos: ProductoView[] = [];
  public selectedProductos: ProductoView[];
  public searchProducto: FormControl = new FormControl();
  public conceptoSource: MatTableDataSource<ConceptoVentaView> =
    new MatTableDataSource([]);

  public displayedColumns: string[] = [
    'producto',
    'cantidad',
    'precio',
    'descuento',
    'importe',
    'options',
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _productoSvc: ProductoService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<NewVentaComponent>,
    private _ventaSvc: VentaService,
    @Inject(MAT_DIALOG_DATA)
    private data: { vendedor: string; tipoVenta: tipoVenta }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initDataClientes();
    this.initDataProductos();
    this.conceptoSource.sort = this.sort;
    this.conceptoSource.data = [];

    this.searchProducto.valueChanges.pipe(startWith('')).subscribe((value) => {
      this.selectedProductos = this._filterProducto(value);
    });

    this.searchCliente.valueChanges.pipe(startWith('')).subscribe((value) => {
      this.selectedClientes = this._filterCliente(value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
  public addVenta(): void {
    const venta: VentaProducto = {
      ...this.ventaForm.value,
      uuidCliente: this.ventaForm.value.uuidCliente.uuid,
      conceptos: [...this.conceptoSource.data],
      total: this.getImporteVenta(),
    };

    if (venta.tipoVenta === 'fisica') {
      this._ventaSvc.addVentaFisica(venta).subscribe(() => {
        this.dialogRef.close(true);
      });
    }

    if (venta.tipoVenta === 'online') {
      this._ventaSvc.addVentaOnline(venta).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  public onSelectCliente(usuario: Usuario): void {
    this.ventaForm.patchValue({
      direccion: usuario.direccion,
      nombreFactura: `${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`,
    });
  }

  public goBack(stepper: MatStepper) {
    stepper.previous();
  }

  public goForward(stepper: MatStepper) {
    stepper.next();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.ventaForm = this.fb.group({
      uuidCliente: ['', Validators.required],
      nombreFactura: ['', [Validators.required, Validators.maxLength(100)]],
      nitCiCex: ['', Validators.required],
      departamento: ['cbba', Validators.required],
      tipoVenta: [this.data.tipoVenta],
      tipoEnvio: ['personal', Validators.maxLength(200)],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', Validators.maxLength(200)],
      metodoDePago: ['efectivo', Validators.required],
      estado: ['confirmado'],
      uuidVendedor: [this.data.vendedor],
    });

    this.conceptoVentaForm = this.fb.group({
      producto: ['', Validators.required],
      uuidProducto: ['', Validators.required],
      cantidad: [0],
      precioUnitario: [0],
      descuento: [0],
      importe: [0],
    });
  }

  // ===================> initDataClientes
  public loadSelectClientes(): void {
    this.selectedClientes = this.clientes;
    this.searchCliente.setValue('');
  }
  private initDataClientes(): void {
    this.usuarioSvc
      .getAllUsuarios()
      .pipe(
        map((usuarios: Usuario[]) =>
          usuarios.filter((usuario: Usuario) => usuario.rol === 'cliente')
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((clientes: Usuario[]) => {
        if (!clientes.length) {
          const dialogRef = this.dialog.open(ClienteModalComponent);
          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: boolean) => {
              if (res) {
                dialogRef.close();
                this.dialogRef.close(this.ventaForm);
                this.router.navigate(['admin/usuarios']);
              } else {
                dialogRef.close();
                this.dialogRef.close(this.ventaForm);
              }
            });
        }
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }

  // ===================> initDataProductos

  private initDataProductos(): void {
    this._productoSvc
      .getAllProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productos: Producto[]) => {
        this.selectedProductos = productos;
        this.productos = productos;
      });
  }

  public addProductoTable(producto: ProductoView): void {
    if (
      !this.conceptoSource.data.find(
        (concepto) => concepto.producto.uuid === producto.uuid
      ) &&
      producto
    ) {
      let newConcepto: ConceptoVentaView = {
        cantidad: 1,
        precioUnitario: producto.precio,
        descuento: producto.descuento,
        uuidProducto: producto.uuid,
        producto,
      };

      newConcepto.importe = this.getImporteConcepto(newConcepto);

      this.conceptoSource.data = [newConcepto, ...this.conceptoSource.data];
    }
  }

  public getImporteConcepto(concepto: ConceptoVentaView): number {
    return (
      (concepto.precioUnitario -
        (concepto.precioUnitario * concepto.descuento) / 100) *
      concepto.cantidad
    );
  }

  public upCantidad(concepto: ConceptoVentaView): void {
    this.conceptoSource.data = this.conceptoSource.data.map((ct) => {
      if (
        ct.uuidProducto === concepto.producto.uuid &&
        ct.cantidad < ct.producto.stock
      ) {
        ct.cantidad++;
        ct.importe = this.getImporteConcepto(ct);
      }
      return ct;
    });
  }

  public downCantidad(concepto: ConceptoVentaView): void {
    this.conceptoSource.data = this.conceptoSource.data.map((ct) => {
      if (ct.uuidProducto === concepto.producto.uuid && ct.cantidad > 1) {
        ct.cantidad--;
        ct.importe = this.getImporteConcepto(ct);
      }
      return ct;
    });
  }

  public deleteConcepto(concepto: ConceptoVentaView): void {
    this.conceptoSource.data = this.conceptoSource.data.filter(
      (ct) => ct.uuidProducto !== concepto.uuidProducto
    );
  }

  public getImporteVenta(): string {
    return this.conceptoSource.data
      .map((ct) => ct.importe)
      .reduce((acc, value) => acc + value, 0)
      .toFixed(2);
  }

  public loadSelectProductos(): void {
    this.selectedProductos = this.productos;
    this.searchProducto.setValue('');
  }

  private _filterProducto(value: string): ProductoView[] {
    const filterValue = this._normalizeValue(value);

    return this.productos.filter(
      (product: ProductoView) =>
        this._normalizeValue(product.nombre).includes(filterValue) ||
        product.categorias
          .map((cat) => this._normalizeValue(cat.nombre))
          .includes(filterValue)
    );
  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase();
  }

  public getImage(keyName: string): string {
    return `${this.API_URL}/api/file/${keyName}`;
  }

  public onLoadTab(e: StepperSelectionEvent): void {
    switch (e.selectedIndex) {
      case 0:
        this.continuar = true;
        break;

      case 1:
        this.continuar = false;
        break;
      default:
        break;
    }
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.ventaForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }

  public isValidFieldConcepto(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.conceptoVentaForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }

  // ============> filterCliente
  private _filterCliente(value: string): Usuario[] {
    const filterValue = this._normalizeValue(value);

    return this.clientes.filter((cliente) => {
      return (
        cliente.nombre.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0
      );
    });
  }
}
