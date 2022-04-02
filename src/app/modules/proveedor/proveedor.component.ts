import { ProveedorView } from './../../shared/models/mendoraki/proveedor.interface';
import { EditProveedorComponent } from './components/edit-proveedor/edit-proveedor.component';
import { AddProveedorComponent } from './components/add-proveedor/add-proveedor.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DeleteModalComponent } from '@shared/components/delete-modal/delete-modal.component';
import { Proveedor } from '@models/mendoraki/proveedor.interface';
import { ProveedorService } from '@app/core/services/mendoraki/proveedor.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss'],
})
export class ProveedorComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  public proveedor: ProveedorView[];

  public stats = {
    total: 0,
    mendozarq: 0,
    liraki: 0,
    mendoraki: 0,
  };

  selected: ProveedorView[] = [];
  selection = new SelectionModel<ProveedorView>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion',
    'nombre',
    'celular',
    'direccion',
    'uuidRecurso',
    'descripcion',
    'edit',
  ];

  dataSource: MatTableDataSource<ProveedorView> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private proveedorSvc: ProveedorService
  ) {}

  // =====================> onInit
  ngOnInit(): void {
    this.getAllProveedor();

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

  // =====================> getAllProveedor
  getAllProveedor(): void {
    this.proveedorSvc
      .getAllProveedor()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataSource.data = res;
        this.proveedor = res;

        // this.stats.total = res.length;
        // this.stats.mendozarq = res.filter((r) => r.area === 'mendozarq').length;
        // this.stats.liraki = res.filter((r) => r.area === 'liraki').length;
        // this.stats.mendoraki = res.filter((r) => r.area === 'mendoraki').length;
      });
  }

  // =====================> onAddProveedor
  onAddProveedor(): void {
    const dialogRef = this.dialog.open(AddProveedorComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllProveedor();
        }
      });
  }

  // =====================> oneditProveedor
  onUpdateProveedor(proveedor: ProveedorView): void {
    const dialogRef = this.dialog.open(EditProveedorComponent, {
      data: proveedor,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllProveedor();
        }
      });
  }

  // =====================> ondeleteProveedor
  async onDeleteProveedor(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneProveedor()
            : this.deleteMoreThanOneProveedor();
        }
      });
  }

  // =====================> deleteOneProveedor
  deleteOneProveedor(): void {
    this.proveedorSvc
      .deleteProveedor(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usr) => {
        if (usr) {
          this.toastSvc.success(
            'Se ha eliminado correctamente',
            'Proveedor Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllProveedor();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOneProveedor
  deleteMoreThanOneProveedor(): void {
    this.selected.forEach((proveedor, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.proveedorSvc
        .deleteProveedor(proveedor.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            this.toastSvc.success(
              'Se han eliminado correctamente',
              'Proveedor Eliminado',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllProveedor();
            this.clearCheckbox();
          }
        });
    });
  }

  // !important, this part is for table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {
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
  checkboxLabel(row?: ProveedorView): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.nombre
    }`;
  }
}
