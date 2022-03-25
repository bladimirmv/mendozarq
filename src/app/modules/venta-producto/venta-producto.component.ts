import { ActivatedRoute } from '@angular/router';
import { NewVentaComponent } from './components/new-venta/new-venta.component';
import { MatDialog } from '@angular/material/dialog';
import { VentaService } from '@services/liraki/venta.service';
import { VentaView } from '@models/liraki/venta.interface';
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
  constructor(
    private _ventaSvc: VentaService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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

  private initData(): void {
    this._ventaSvc.getAllVentaFisica().subscribe((ventas) => {
      this.dataSourceVenta.data = ventas;
      this.ventas = ventas;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  public addVenta(): void {
    this.dialog.open(NewVentaComponent, {
      data: this.route.snapshot.data['usuario']?.uuid,
    });
  }

  updateVenta(): void {}

  deleteVenta(): void {}

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
}
