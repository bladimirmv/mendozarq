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
  displayedColumns: string[] = ['seleccion', 'nombre', 'descripcion', 'categoria', 'edit'];

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
  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // ====================================================================
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  // ====================================================================
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  // ====================================================================
  clearCheckbox(): void {
    this.selection.clear();
  }
  // ====================================================================
  checkboxLabel(row?: Recurso): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nombre}`;
  }
  // ====================================================================


}
