import { PedidosService } from '@services/liraki/pedidos.service';
import { PedidoProductoView } from '@models/liraki/pedido.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CapituloPresupuesto } from '@models/mendozarq/presupuestos.interface';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil, map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  public panelOpenState = false;
  public filterValuePedido: string;
  public dataSourcePedido: MatTableDataSource<PedidoProductoView> =
    new MatTableDataSource();
  public columnsToDisplay: Array<string> = [
    'seleccion',
    'numeroPedido',
    'estado',
    'metodoDePago',
    'tipoEnvio',
    'nombre',
    'nombreFactura',
    'nitCI',
    'total',
  ];
  public expandedElement: CapituloPresupuesto | null;
  public selectedPedido: PedidoProductoView[] = [];
  public selectionCapitulo = new SelectionModel<PedidoProductoView>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private destroy$: Subject<any> = new Subject<any>();

  constructor(private _pedidosSvc: PedidosService) {}

  ngOnInit(): void {
    this._pedidosSvc.getPedidoAllProducto().subscribe((res) => {
      this.dataSourcePedido.data = res;
    });

    this.dataSourcePedido.paginator = this.paginator;
    this.dataSourcePedido.sort = this.sort;
    this.selectionCapitulo.changed
      .pipe(
        takeUntil(this.destroy$),
        map((a) => a.source)
      )
      .subscribe((data) => (this.selectedPedido = data.selected));
  }

  // !important, this part is for table.
  // =====================> applyFilterPersonal
  applyFilterCapitulo(event: Event | string): void {
    typeof event === 'string'
      ? (this.filterValuePedido = event)
      : (this.filterValuePedido = (event.target as HTMLInputElement).value);
    this.dataSourcePedido.filter = this.filterValuePedido.trim().toLowerCase();
    if (this.dataSourcePedido.paginator) {
      this.dataSourcePedido.paginator.firstPage();
    }
  }
  // =====================>
  isAllSelectedPedidos(): any {
    const numSelected = this.selectionCapitulo.selected.length;
    const numRows = this.dataSourcePedido.data.length;
    return numSelected === numRows;
  }
  // =====================>
  masterToggle(): void {
    this.isAllSelectedPedidos()
      ? this.selectionCapitulo.clear()
      : this.dataSourcePedido.data.forEach((row) =>
          this.selectionCapitulo.select(row)
        );
  }
  // =====================>
  clearCheckbox(): void {
    this.selectionCapitulo.clear();
  }
  // =====================>
  checkboxLabel(row?: PedidoProductoView): string {
    if (!row) {
      return `${this.isAllSelectedPedidos() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selectionCapitulo.isSelected(row) ? 'deselect' : 'select'
    } row ${row.uuid}`;
  }
}
