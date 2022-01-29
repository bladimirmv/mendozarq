import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  VentaProducto,
  VentaProductoView,
} from '@models/liraki/venta.producto.interface';
import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { map, takeUntil } from 'rxjs/operators';

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
  expandedElement: VentaProductoView | null;

  private ventaProducto: VentaProductoView[] = [];
  public filterValueVentaProducto: string;
  public dataSourceVentaProducto: MatTableDataSource<VentaProductoView> =
    new MatTableDataSource();

  selectedVentaProducto: VentaProductoView[] = [];
  selectionVentaProducto = new SelectionModel<VentaProductoView>(true, []);

  columnsToDisplay: Array<string> = [
    'creadoEn',
    'cliente',
    'vendedor',
    'tipoVenta',
    'metodoPago',
    'total',
    'edit',
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  panelOpenState = false;
  constructor() {}

  ngOnInit(): void {
    this.initData();

    this.dataSourceVentaProducto.paginator = this.paginator;
    this.dataSourceVentaProducto.sort = this.sort;

    this.selectionVentaProducto.changed
      .pipe(
        takeUntil(this.destroy$),
        map((a) => a.source)
      )
      .subscribe((data) => (this.selectedVentaProducto = data.selected));
  }

  private initData(): void {}

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  addVentaProducto(): void {}

  updateVentaProducto(): void {}

  deleteVentaProducto(): void {}

  // !important, this part is for table.
  // =====================> applyFilter
  applyFilterVentaProducto(event: Event | string): void {
    typeof event === 'string'
      ? (this.filterValueVentaProducto = event)
      : (this.filterValueVentaProducto = (
          event.target as HTMLInputElement
        ).value);
    this.dataSourceVentaProducto.filter = this.filterValueVentaProducto
      .trim()
      .toLowerCase();
    if (this.dataSourceVentaProducto.paginator) {
      this.dataSourceVentaProducto.paginator.firstPage();
    }
  }
  // =====================>
  isAllSelectedVentaProducto(): any {
    const numSelected = this.selectionVentaProducto.selected.length;
    const numRows = this.dataSourceVentaProducto.data.length;
    return numSelected === numRows;
  }
  // =====================>
  masterToggle(): void {
    this.isAllSelectedVentaProducto()
      ? this.selectionVentaProducto.clear()
      : this.dataSourceVentaProducto.data.forEach((row) =>
          this.selectionVentaProducto.select(row)
        );
  }
  // =====================>
  clearCheckbox(): void {
    this.selectionVentaProducto.clear();
  }
  // =====================>
  checkboxLabel(row?: VentaProductoView): string {
    if (!row) {
      return `${this.isAllSelectedVentaProducto() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selectionVentaProducto.isSelected(row) ? 'deselect' : 'select'
    } row ${row.uuid}`;
  }
}
