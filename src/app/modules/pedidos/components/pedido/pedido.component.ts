import { takeUntil, map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { PedidoProductoView } from '@models/liraki/pedido.interface';
import { PedidosService } from '@services/liraki/pedidos.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CarritoPedido } from '@app/shared/models/liraki/pedido.interface';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent implements OnInit {
  public pedidoCarritoForm: FormGroup;
  private uuidPedido: string = '';
  public pedidoProducto: PedidoProductoView = {} as PedidoProductoView;

  public panelOpenState = false;
  public filterValue: string;
  public dataSource: MatTableDataSource<CarritoPedido> =
    new MatTableDataSource();
  public columnsToDisplay: Array<string> = [
    'seleccion',
    'nombre',
    'precio',
    'descuento',
    'cantidad',
    'total',
    'options',
  ];
  public selectedCarritoPedido: CarritoPedido[] = [];
  public selectionCarritoPedido = new SelectionModel<CarritoPedido>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _pedidosSvc: PedidosService
  ) {}

  ngOnInit(): void {
    this.uuidPedido = this.route.snapshot.params['uuid'];
    this.initPedidoCarritoForm();
    this.initDataPedido();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectionCarritoPedido.changed
      .pipe(
        takeUntil(this.destroy$),
        map((a) => a.source)
      )
      .subscribe((data) => (this.selectedCarritoPedido = data.selected));
  }

  private initDataPedido(): void {
    this._pedidosSvc
      .getPedidoProductoByUuid(this.uuidPedido)
      .subscribe((pedido: PedidoProductoView) => {
        this.pedidoProducto = pedido;
        this.initPedidoCarritoForm();
        this.dataSource.data = pedido.carrito;
      });
  }

  // !form pedido
  private initPedidoCarritoForm(): void {
    this.pedidoCarritoForm = this._formBuilder.group({
      nombre: [
        this.pedidoProducto?.nombre,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
          ),
        ],
      ],
      apellidoPaterno: [
        this.pedidoProducto?.apellidoPaterno,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
          ),
        ],
      ],
      apellidoMaterno: [
        this.pedidoProducto?.apellidoMaterno,
        [
          Validators.maxLength(50),
          Validators.pattern(
            /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
          ),
        ],
      ],
      celular: [
        this.pedidoProducto?.celular,
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      direccion: [
        this.pedidoProducto?.direccion,
        [Validators.maxLength(200), Validators.required],
      ],
      correo: [
        this.pedidoProducto?.correo,
        [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)],
      ],
      nombreFactura: [this.pedidoProducto?.nombreFactura, Validators.required],
      nitCI: [this.pedidoProducto?.nitCI, Validators.required],
      tipoEnvio: [this.pedidoProducto?.tipoEnvio, Validators.required],
      descripcion: [
        this.pedidoProducto?.descripcion,
        [Validators.maxLength(500)],
      ],
      metodoDePago: [this.pedidoProducto?.metodoDePago, Validators.required],
    });
  }

  // ===========> isValidField
  public isValidField(field: string): {
    color?: string;
    status?: boolean;
    icon?: string;
  } {
    const validateFIeld = this.pedidoCarritoForm.get(field);
    return !validateFIeld.valid && validateFIeld.touched
      ? { color: 'warn', status: false, icon: 'close' }
      : validateFIeld.valid
      ? { color: 'accent', status: true, icon: 'done' }
      : {};
  }
  // ===========> getString
  public getString(num: number): string {
    return String(num);
  }

  public getTotalPrice(): string {
    return this.pedidoProducto.carrito
      ?.map((c) => Number(this.getDescuento(c)))
      .reduce((acc, value) => acc + value, 0)
      .toFixed(2);
  }

  public getDescuento(producto: CarritoPedido): string {
    let result: number = 0;
    producto.descuento > 100 || producto.descuento < 0
      ? (result = 0)
      : (result =
          producto.precio - (producto.precio * producto.descuento) / 100);
    return (result * producto.cantidad).toFixed(2);
  }

  // !important, this part is for table.
  // =====================> applyFilterPersonal
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? (this.filterValue = event)
      : (this.filterValue = (event.target as HTMLInputElement).value);
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // =====================>
  isAllSelected(): any {
    const numSelected = this.selectionCarritoPedido.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  // =====================>
  masterToggle(): void {
    this.isAllSelected()
      ? this.selectionCarritoPedido.clear()
      : this.dataSource.data.forEach((row) =>
          this.selectionCarritoPedido.select(row)
        );
  }
  // =====================>
  clearCheckbox(): void {
    this.selectionCarritoPedido.clear();
  }
  // =====================>
  checkboxLabel(row?: CarritoPedido): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selectionCarritoPedido.isSelected(row) ? 'deselect' : 'select'
    } row ${row.uuid}`;
  }
}
