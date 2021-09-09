import { EditCategoriaProductoComponent } from './components/edit-categoria-producto/edit-categoria-producto.component';
import { NewCategoriaProductoComponent } from './components/new-categoria-producto/new-categoria-producto.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaProductoService } from './../../core/services/liraki/categoria-producto.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, OnDestroy, Pipe } from '@angular/core';

import { CategoriaProducto } from '@models/liraki/categoria.producto.interface';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
@Component({
  selector: 'app-categoria-producto',
  templateUrl: './categoria-producto.component.html',
  styleUrls: ['./categoria-producto.component.scss']
})
export class CategoriaProductoComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();


  selected: CategoriaProducto[] = [];
  selection = new SelectionModel<CategoriaProducto>(true, []);
  filterValue: string;
  public columns: Array<string> = ['seleccion', 'nombre', 'descripcion', 'edit'];
  public source: MatTableDataSource<CategoriaProducto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private categoriaProductoSvc: CategoriaProductoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAllCategoriaProducto();

    this.source.paginator = this.paginator;
    this.source.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  private getAllCategoriaProducto(): void {
    this.categoriaProductoSvc
      .getAllCategoriaProducto()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categorias: CategoriaProducto[]) => {
        this.source.data = categorias;
      });
  }

  public addCategoriaProducto(): void {
    const dialogRef = this.dialog.open(NewCategoriaProductoComponent);
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res === true) {
          this.getAllCategoriaProducto();
        }
      });
  }

  public editCategoriaProducto(categoriaProducto: CategoriaProducto): void {
    const dialogRef = this.dialog.open(EditCategoriaProductoComponent, {
      data: categoriaProducto
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllCategoriaProducto();
        }
      });
  }

  public deleteCategoriaProducto(): void {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneCategoriaProducto()
            : this.deleteMoreThanOneCategoriaProducto();
        }
      });
  }

  private deleteOneCategoriaProducto(): void {
    this.categoriaProductoSvc
      .deleteCategoriaProducto(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.toastrSvc.success('Se ha eliminado correctamente', 'Categoria Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllCategoriaProducto();
          this.clearCheckbox();
        }
      });
  }

  private deleteMoreThanOneCategoriaProducto(): void {
    this.selected.forEach((servicio, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.categoriaProductoSvc
        .deleteCategoriaProducto(servicio.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastrSvc.success('Se han eliminado correctamente', 'Categorias Eliminados', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllCategoriaProducto()
            this.clearCheckbox();
          }
        });

    });
  }

  // !important, this part is for categoriaProducto table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValue = event
      : this.filterValue = (event.target as HTMLInputElement).value;

    this.source.filter = this.filterValue.trim().toLowerCase();
    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }
  // =====================> isAllSelected
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.source.data.length;
    return numSelected === numRows;
  }
  // =====================> masterToggle
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.source.data.forEach(row => this.selection.select(row));
  }
  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }
  // =====================> checkboxLabel
  checkboxLabel(row?: CategoriaProducto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }

}
