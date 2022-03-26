import { environment } from './../../../../../environments/environment.prod';
import {
  Producto,
  ProductoView,
} from './../../../../shared/models/liraki/producto.interface';
import { ProductoService } from './../../../../core/services/liraki/producto.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';
import { UsuarioService } from '@services/auth/usuario.service';

import { Proyecto } from '@app/shared/models/mendozarq/proyecto.interface';
import { Usuario } from '@app/shared/models/usuario.interface';
import { ClienteModalComponent } from '@app/modules/proyectos/components/cliente-modal/cliente-modal.component';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-new-venta',
  templateUrl: './new-venta.component.html',
  styleUrls: ['./new-venta.component.scss'],
})
export class NewVentaComponent implements OnInit, OnDestroy {
  private API_URL = environment.API_URL;
  private destroy$ = new Subject<any>();

  public proyectoForm: FormGroup;
  private clientes: Usuario[] = [];
  public selectedClientes: Usuario[] = [];

  public conceptoVentaForm: FormGroup;
  public productos: ProductoView[] = [];
  public selectedProductos: ProductoView[] = [];

  displayedColumns: string[] = [
    'producto',
    'cantidad',
    'precio',
    'descuento',
    'importe',
  ];
  transactions = [
    { item: 'Beach ball', cost: 4 },
    { item: 'Towel', cost: 5 },
    { item: 'Frisbee', cost: 2 },
    { item: 'Sunscreen', cost: 4 },
    { item: 'Cooler', cost: 25 },
    { item: 'Swim suit', cost: 15 },
  ];

  constructor(
    private _productoSvc: ProductoService,
    private toastrSvc: ToastrService,
    private usuarioSvc: UsuarioService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private dialogRef: MatDialogRef<NewVentaComponent>,
    @Inject(MAT_DIALOG_DATA) private uuidVendedor
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initDataClientes();
    this.initDataProductos();
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  // =====================> onInitForm
  private initForm(): void {
    this.proyectoForm = this.fb.group({
      uuidCliente: ['', Validators.required],
      nombreFactura: ['', [Validators.required, Validators.maxLength(100)]],
      nitCiCex: ['', Validators.required],
      departamento: ['cbba', Validators.required],
      tipoVenta: ['fisica'],
      tipoEnvio: ['personal', Validators.maxLength(200)],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', Validators.maxLength(200)],
      metodoDePago: ['efectivo', Validators.required],
      estado: ['confirmado'],
      uuidVendedor: [this.uuidVendedor],
    });
    this.conceptoVentaForm = this.fb.group({
      uuidProducto: ['', Validators.required],
      cantidad: [0],
      precioUnitario: [0],
      descuento: [0],
      importe: [0],
    });
  }

  // ===================> initDataClientes
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
                this.dialogRef.close(this.proyectoForm);
                this.router.navigate(['admin/usuarios']);
              } else {
                dialogRef.close();
                this.dialogRef.close(this.proyectoForm);
              }
            });
        }
        this.selectedClientes = clientes;
        this.clientes = clientes;
      });
  }

  private initDataProductos(): void {
    this._productoSvc
      .getAllProductos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productos: Producto[]) => {
        this.selectedProductos = productos;
        this.productos = productos;
      });
  }

  public getImage(keyName: string): string {
    return `${this.API_URL}/api/file/${keyName}`;
  }

  // ===================> onAddProyecto
  public onAddProyecto(proyecto: Proyecto): void {
    // proyecto.porcentaje = 0;
    // this.proyectoSvc
    //   .addProyecto(proyecto)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((proy) => {
    //     if (proy) {
    //       this.toastrSvc.success(
    //         'El proyecto se ha creado correctamente. 😀',
    //         'Proyecto Creado'
    //       );
    //       this.dialogRef.close();
    //     }
    //   });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.proyectoForm.get(field);
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

  // ============> onKeySearch
  public onKey(value) {
    this.selectedClientes = this._filter(value);
  }

  public onKeyProducto(value) {
    const filterValue = this._normalizeValue(value);

    this.selectedProductos = this.productos.filter(
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
  // ============> filterCliente
  private _filter(value: string): Usuario[] {
    const filterValue = value.toLowerCase();

    return this.clientes.filter((cliente) => {
      return (
        cliente.nombre.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoPaterno.toLowerCase().indexOf(filterValue) === 0 ||
        cliente.apellidoMaterno.toLowerCase().indexOf(filterValue) === 0
      );
    });
  }
}
