import { OpinionProductoService } from './../../core/services/liraki/opinion-producto.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DeleteModalComponent } from './../../shared/components/delete-modal/delete-modal.component';
import { Personal } from '@models/mendozarq/personal.interface';
import { PersonalService } from '@app/core/services/mendozarq/personal.service';
import { OpinionProductoView } from '@app/shared/models/liraki/opinion.producto.interface';
import { log10 } from 'chart.js/helpers';
@Component({
  selector: 'app-opinion-producto',
  templateUrl: './opinion-producto.component.html',
  styleUrls: ['./opinion-producto.component.scss'],
})
export class OpinionProductoComponent implements OnInit {
  private destroy$ = new Subject<any>();
  public opiniones: OpinionProductoView[];

  selected: OpinionProductoView[] = [];
  selection = new SelectionModel<OpinionProductoView>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion',
    'estado',
    'creadoEn',
    'cliente',
    'titulo',
    'descripcion',
    'verificado',
    'puntuacion',
    'producto',
    'edit',
  ];

  dataSource: MatTableDataSource<OpinionProductoView> =
    new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private personalSvc: PersonalService,
    private _opinionSvc: OpinionProductoService
  ) {}

  // =====================> onInit
  ngOnInit(): void {
    this.getAllOpiniones();

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
    // this.locationBarSvc.popLocation();
  }

  // =====================> getAllPersonal
  getAllOpiniones(): void {
    this._opinionSvc
      .getAllOpinion()
      .subscribe((opiniones: OpinionProductoView[]) => {
        this.dataSource.data = opiniones;
        this.opiniones = opiniones;

        console.log(opiniones);
      });
  }

  // =====================> onAddPersonal
  onAddPersonal(): void {
    // const dialogRef = this.dialog.open(NewPersonalComponent);
    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res) => {
    //     this.getAllPersonal();
    //   });
  }

  // =====================> oneditPersonal
  onUpdatePersonal(personal: Personal): void {
    // const dialogRef = this.dialog.open(EditPersonalComponent, {
    //   data: personal,
    // });
    // dialogRef
    //   .afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.getAllPersonal();
    //   });
  }

  // =====================> ondeletePersonal
  async onDeletePersonal(): Promise<void> {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOnePersonal()
            : this.deleteMoreThanOnePersonal();
        }
      });
  }

  // =====================> deleteOnePersonal
  deleteOnePersonal(): void {
    this.personalSvc
      .deletePersonal(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe((usr) => {
        if (usr) {
          this.toastSvc.success(
            'Se ha eliminado correctamente',
            'Personal Eliminado',
            {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
            }
          );
          this.getAllOpiniones();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOnePersonal
  deleteMoreThanOnePersonal(): void {
    this.selected.forEach((personal, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.personalSvc
        .deletePersonal(personal.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res) {
            this.toastSvc.success(
              'Se han eliminado correctamente',
              'Personal Eliminado',
              {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
              }
            );
            this.getAllPersonal();
            this.clearCheckbox();
          }
        });
    });
  }

  // =====================> openSnackBarCopy
  openSnackBarCopy(): void {
    // this.snackBar.open('Copiado', 'Cerrar', {
    //   duration: 500,
    //   horizontalPosition: 'center',
    //   verticalPosition: 'bottom',
    // });
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
  checkboxLabel(row?: OpinionProductoView): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.uuid
    }`;
  }
}
