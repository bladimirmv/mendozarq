import { AddRecursoComponent } from './add-recurso/add-recurso.component';
import { EditRecursoComponent } from './edit-recurso/edit-recurso.component';
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
import { Recurso } from '@models/mendoraki/recurso.interface';
import { RecursoService } from '@app/core/services/mendoraki/recurso.service';

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.scss'],
})
export class RecursoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  public recurso: Recurso[];

  public stats = {
    total: 0,
    mendozarq: 0,
    liraki: 0,
    mendoraki: 0,
  };

  selected: Recurso[] = [];
  selection = new SelectionModel<Recurso>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion',
    'nombre',
    'tipoRecurso',
    'area',
    'precioUnitario',
    'precioPorMayor',
    'descripcion',
    'edit',
  ];

  dataSource: MatTableDataSource<Recurso> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private recursoSvc: RecursoService
  ) {}

  // =====================> onInit
  ngOnInit(): void {
    this.getAllRecurso();

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

  // =====================> getAllRecurso
  getAllRecurso(): void {
    this.recursoSvc
      .getAllRecurso()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataSource.data = res;
        this.recurso = res;

        this.stats.total = res.length;
        this.stats.mendozarq = res.filter((r) => r.area === 'mendozarq').length;
        this.stats.liraki = res.filter((r) => r.area === 'liraki').length;
        this.stats.mendoraki = res.filter((r) => r.area === 'mendoraki').length;
      });
  }

  // =====================> onAddRecurso
  onAddRecurso(): void {
    const dialogRef = this.dialog.open(AddRecursoComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getAllRecurso();
      });
  }

  // =====================> oneditRecurso
  onUpdateRecurso(recurso: Recurso): void {
    const dialogRef = this.dialog.open(EditRecursoComponent, {
      data: recurso,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllRecurso();
      });
  }

  // =====================> ondeleteRecurso
  async onDeleteRecurso(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneRecurso()
            : this.deleteMoreThanOneRecurso();
        }
      });
  }

  // =====================> deleteOneRecurso
  deleteOneRecurso(): void {
    this.recursoSvc
      .deleteRecurso(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usr) => {
        if (usr) {
          this.toastSvc.success(
            'Se ha eliminado correctamente',
            'Recurso Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllRecurso();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOneRecurso
  deleteMoreThanOneRecurso(): void {
    this.selected.forEach((recurso, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.recursoSvc
        .deleteRecurso(recurso.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            this.toastSvc.success(
              'Se han eliminado correctamente',
              'Recurso Eliminado',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllRecurso();
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
  checkboxLabel(row?: Recurso): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.nombre
    }`;
  }
}
