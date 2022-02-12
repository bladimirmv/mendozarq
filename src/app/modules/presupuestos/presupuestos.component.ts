import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { PresupuestoObra } from '@models/mendozarq/presupuestos.interface';

import { PresupuestosService } from '@services/mendozarq/presupuestos.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NewPresupuestoComponent } from './components/new-presupuesto/new-presupuesto.component';
import { TimeFormatService } from '@services/time-format.service';
import { EditPresupuestoComponent } from './components/edit-presupuesto/edit-presupuesto.component';

export interface ICardUser {}

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss'],
})
export class PresupuestosComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  public presupuestos: PresupuestoObra[] = [] as PresupuestoObra[];
  public thisYear: number = 0;
  public thisMonth: number = 0;

  response: { error: boolean; msg: string; data?: ICardUser[] } = {
    error: false,
    msg: '',
  };

  selected: PresupuestoObra[] = [];
  selection = new SelectionModel<PresupuestoObra>(true, []);
  filterValue: string;
  public columns: Array<string> = [
    'seleccion',
    'nombre',
    'cliente',
    'fecha',
    'iva',
    'usuario',
    'descripcion',
    'edit',
  ];
  public source: MatTableDataSource<PresupuestoObra> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private activatedRoute: ActivatedRoute,
    private presupuestoObraSvc: PresupuestosService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService,
    public timeFormatSvc: TimeFormatService
  ) {}

  ngOnInit(): void {
    this.getAllPresupuestoObra();

    this.source.paginator = this.paginator;
    this.source.sort = this.sort;

    this.selection.changed
      .pipe(map((a) => a.source))
      .subscribe((data) => (this.selected = data.selected));
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // =====================> getAllPresupuestoObra
  private getAllPresupuestoObra(): void {
    this.presupuestoObraSvc
      .getAllPresupuestoObra()
      .pipe(takeUntil(this.destroy$))
      .subscribe((presupuestos: PresupuestoObra[]) => {
        this.source.data = presupuestos;
        this.presupuestos = presupuestos;

        presupuestos.filter((pre) => {
          this.thisYear +=
            new Date(pre.creadoEn).getFullYear() === new Date().getFullYear()
              ? 1
              : 0;

          this.thisMonth +=
            new Date(pre.creadoEn).getMonth() === new Date().getMonth() ? 1 : 0;
        });
      });
  }

  // =====================> newPresupuestoObra
  public newPresupuestoObra(): void {
    const dialogRef = this.dialog.open(NewPresupuestoComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllPresupuestoObra();
        }
      });
  }
  // =====================> deletePresupuestoObra
  public deletePresupuestoObra() {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOnePresupuestoObra()
            : this.deleteMoreThanOnePresupuestoObra();
        }
      });
  }
  // =====================> deleteOnePresupuestoObra
  private deleteOnePresupuestoObra(): void {
    this.presupuestoObraSvc
      .deletePresupuestoObra(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((pre) => {
        if (pre) {
          this.toastrSvc.success(
            'Se ha eliminado correctamente',
            'Presupuesto Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllPresupuestoObra();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOnePresupuestoObra
  private deleteMoreThanOnePresupuestoObra(): void {
    this.selected.forEach((servicio, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.presupuestoObraSvc
        .deletePresupuestoObra(servicio.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            this.toastrSvc.success(
              'Se han eliminado correctamente',
              'Presupuestos Eliminados',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllPresupuestoObra();
            this.clearCheckbox();
          }
        });
    });
  }

  // =====================> updatePresupuestoObra
  public updatePresupuestoObra(presupuestoObra: PresupuestoObra): void {
    const dialogRef = this.dialog.open(EditPresupuestoComponent, {
      data: presupuestoObra,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllPresupuestoObra();
        }
      });
  }

  // !important, this part is for presupuestoObra table.
  // =====================> applyFilterPersonal
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? (this.filterValue = event)
      : (this.filterValue = (event.target as HTMLInputElement).value);

    this.source.filter = this.filterValue.trim().toLowerCase();
    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }
  // =====================> isAllSelectedPersonal
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.source.data.length;
    return numSelected === numRows;
  }
  // =====================> masterTogglePersonal
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.source.data.forEach((row) => this.selection.select(row));
  }
  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }
  // =====================> checkboxLabel
  checkboxLabel(row?: PresupuestoObra): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.uuid
    }`;
  }
}
