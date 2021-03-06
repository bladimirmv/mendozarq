import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewCategoriaRecursoComponent } from './components/new-categoria-recurso/new-categoria-recurso.component';
import { map, takeUntil } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';



import { CategoriaRecurso } from '@models/mendozarq/categoria.recurso.interface'

import { CategoriaRecursoService } from '@app/core/services/mendozarq/categoria-recurso.service';

import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-categoria-recurso',
  templateUrl: './categoria-recurso.component.html',
  styleUrls: ['./categoria-recurso.component.scss']
})
export class CategoriaRecursoComponent implements OnInit {
  private destroy$ = new Subject<any>();

  // selected: CategoriaRecurso[] = [];
  // selection = new SelectionModel<CategoriaRecurso>(true, []);
  // filterValue: string;
  // displayedColumns: string[] = ['seleccion', 'nombre', 'color', 'descripcion', 'edit'];

  // dataSource: MatTableDataSource<CategoriaRecurso> = new MatTableDataSource<CategoriaRecurso>();
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;

  // public categoriasRecursos$: Observable<CategoriaRecurso[]>;
  // public categoriaRecurso: CategoriaRecurso[];

  constructor(
    private snackBar: MatSnackBar,
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private categoriaRecursoSvc: CategoriaRecursoService
  ) { }

  ngOnInit(): void {
    // this.getAllCategoriasRecursos();

    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    // this.selection.changed
    //   .pipe(map(a => a.source))
    //   .subscribe(data => this.selected = data.selected);

  }
  ngOnDestroy(): void {
    // this.destroy$.next({});
    // this.destroy$.complete();
  }
  // // ====================================================================
  // getAllCategoriasRecursos(): void {
  //   this.categoriasRecursos$ = this.categoriaRecursoSvc.getAllCategoriasRecurso();
  //   this.categoriaRecursoSvc.getAllCategoriasRecurso()
  //     .subscribe(res => {
  //       this.dataSource.data = res;
  //       this.categoriaRecurso = res;
  //     });
  // }
  // // ====================================================================
  // onAddCategoriaRecurso(): void {
  //   const dialogRef = this.dialog.open(NewCategoriaRecursoComponent);
  //   dialogRef.afterClosed()
  //     .subscribe(() => {
  //       this.categoriaRecursoSvc.getAllCategoriasRecurso()
  //         .subscribe(res => {
  //           this.dataSource.data = res;
  //           this.categoriaRecurso = res;
  //         });
  //     });
  // }
  // // ====================================================================
  // applyFilter(event: Event): void {
  //   this.filterValue = (event.target as HTMLInputElement).value;

  //   this.dataSource.filter = this.filterValue.trim().toLowerCase();
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  // // ====================================================================
  // isAllSelected(): any {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }
  // // ====================================================================
  // masterToggle(): void {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  // // ====================================================================
  // clearCheckbox(): void {
  //   this.selection.clear();
  // }
  // // ====================================================================
  // checkboxLabel(row?: CategoriaRecurso): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nombre}`;
  // }
  // // ====================================================================

}
