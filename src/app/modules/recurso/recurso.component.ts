import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewRecursoComponent } from './components/new-recurso/new-recurso.component';
import { RecursoService } from '@services/recurso.service'
import { Recurso } from '@models/mendozarq/recurso.interface'

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.scss']
})
export class RecursoComponent implements OnInit {
  private destroy$ = new Subject<any>();

  selected: Recurso[] = [];
  selection = new SelectionModel<Recurso>(true, []);
  filterValue: string;
  displayedColumns: string[] = ['id_recurso','nombre', 'descripcion', 'categoria'];

  dataSource: MatTableDataSource<Recurso> = new MatTableDataSource<Recurso>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public recursos$: Observable<Recurso[]>;
  public recurso: Recurso[];

  constructor(
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private recursoSvc: RecursoService
  ) { }

  ngOnInit(): void {
    this.getAllRecursos();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
    .pipe(map(a => a.source))
    .subscribe(data => this.selected = data.selected);
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ====================================================================
  getAllRecursos(): void {
    this.recursos$ = this.recursoSvc.getAllRecursos();
    this.recursoSvc.getAllRecursos()
      .subscribe(res => {
        this.dataSource.data = res;
        this.recurso = res;
      });
  }

  // ====================================================================
  onAddRecurso(): void {
    const dialogRef = this.dialog.open(NewRecursoComponent);
    dialogRef.afterClosed()
      .subscribe(() => {
        this.recursoSvc.getAllRecursos()
          .subscribe(res => {
            this.dataSource.data = res;
            this.recurso = res;
          });
      });
  }

  // ====================================================================
  openSnackBarCopy(): void {
    this.snackBar.open('Copiado', 'Cerrar', {
      duration: 500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  // ====================================================================
  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
