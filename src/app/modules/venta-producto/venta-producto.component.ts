import { WebsocketService } from './../../core/services/sockets/websocket.service';
import { ToastrService } from 'ngx-toastr';
import { EditVentaComponent } from './components/edit-venta/edit-venta.component';
import { ActivatedRoute, Router, Resolve } from '@angular/router';
import { NewVentaComponent } from './components/new-venta/new-venta.component';
import { MatDialog } from '@angular/material/dialog';
import { VentaService } from '@services/liraki/venta.service';
import { estado, VentaView } from '@models/liraki/venta.interface';
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
    private route: ActivatedRoute,
    private toastrSvc: ToastrService,
    private _wsService: WebsocketService
  ) {}

  ngOnInit(): void {
    this._wsService.emit('ws:ventas');

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
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private initData(): void {
    this._wsService
      .listen('ws:ventas')
      .pipe(takeUntil(this.destroy$))
      .subscribe((ventas: VentaView[]) => {
        this.dataSourceVenta.data = ventas;
        this.ventas = ventas;
      });

    // this._ventaSvc.getAllVentaFisica().subscribe((ventas) => {
    //   this.dataSourceVenta.data = ventas;
    //   this.ventas = ventas;
    // });
  }

  public addVenta(): void {
    const dialog = this.dialog.open(NewVentaComponent, {
      data: this.route.snapshot.data['usuario']?.uuid,
      disableClose: true,
      minWidth: '400px',
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            '😀 Se ha agregado correctamente',
            'Venta Realizado'
          );
          this.initData();
        }
      });
  }

  public updateVenta(currentVenta: VentaView): void {
    const dialog = this.dialog.open(EditVentaComponent, {
      data: currentVenta,
      disableClose: true,
      minWidth: '400px',
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.toastrSvc.success(
            '😀 Se ha actualizado correctamente',
            'Venta Actualizado'
          );
          // this.initData();
        }
      });
  }

  public updateEstado(venta: VentaView, option: number): void {
    switch (option) {
      case 1:
        venta.estado = 'pendiente';
        break;
      case 2:
        venta.estado = 'confirmado';
        break;
      case 3:
        venta.estado = 'para_recoger';
        break;
      case 4:
        venta.estado = 'en_envio';
        break;
      case 5:
        venta.estado = 'completado';
        break;
      default:
        break;
    }

    this._ventaSvc.updateEstadoVenta(venta.uuid, venta).subscribe(() => {
      this.toastrSvc.success(
        '😀 Se ha actualizado correctamente',
        'Estado Actualizado'
      );
      this.initData();
    });
  }

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
