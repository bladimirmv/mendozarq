import { Component, OnInit, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { map } from 'rxjs/operators';

import { CategoriaProyectoService } from '@services/categoria-proyecto.service';
import { CategoriaProyecto } from '@models/mendozarq/categoria.proyecto.interface';
import { NewCategoriaProyectoComponent } from './components/new-categoria-proyecto/new-categoria-proyecto.component';
import { EditCategoriaProyectoComponent } from './components/edit-categoria-proyecto/edit-categoria-proyecto.component';
@Component({
  selector: 'app-categoria-proyecto',
  templateUrl: './categoria-proyecto.component.html',
  styleUrls: ['./categoria-proyecto.component.scss']
})
export class CategoriaProyectoComponent implements OnInit {
  selected: CategoriaProyecto[] = [];
  selection = new SelectionModel<CategoriaProyecto>(true, []);
  filterValue: string;
  displayedColumns: string[] = ['seleccion', 'nombre', 'color', 'edit'];

  dataSource: MatTableDataSource<CategoriaProyecto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public categoriaProyecto: CategoriaProyecto[];
  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private catProyectoSvc: CategoriaProyectoService) {
  }

  ngOnInit(): void {
    this.catProyectoSvc.getAllCategoriaProyecto()
      .subscribe(res => {
        this.dataSource.data = res;
        this.categoriaProyecto = res;
      });


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }
  // ====================================================================
  onAddCategoriaProyecto(): void {
    this.dialog.open(NewCategoriaProyectoComponent);
  }
  // ====================================================================
  onUpdateCategoriaProyecto(catProyecto: CategoriaProyecto): void {
    this.dialog.open(EditCategoriaProyectoComponent, { data: catProyecto });
  }

  // ====================================================================
  ondeleteCategoriaProyecto(): void {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'No podras revertir el cambio!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FF0000',
      cancelButtonColor: '#425066',
      confirmButtonText: 'Eliminar'
    }).then(async (result) => {
      if (result.value) {

        if (this.selected.length === 1) {

          this.catProyectoSvc.deleteCategoriaProyecto(this.selected[0])
            .then(() => {
              this.toastSvc.success('Se ha eliminado correctamente', 'Categoria Eliminado', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing'
              });
              this.clearCheckbox();
            })
            .catch(error => {
              console.log(error);
              Swal.fire('Error!', 'Ocurrio un error al eliminar la categoria', 'error');
            });

        } else {
          try {
            this.selected.forEach((catProyecto, index) => {
              if (index + 1 === this.selected.length) {
                this.catProyectoSvc.deleteCategoriaProyecto(catProyecto)
                  .then(() => {
                    this.toastSvc.success('Se han eliminado correctamente', 'Categoria Eliminado', {
                      timeOut: 2000,
                      progressBar: true,
                      progressAnimation: 'increasing'
                    });
                    this.clearCheckbox();
                  });
              } else {
                this.catProyectoSvc.deleteCategoriaProyecto(catProyecto);
              }
            });
          }
          catch (error) {
            console.log('Error:', error);
            this.toastSvc.error('Se ha producido un error.', 'Error al Eliminar!', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
          }
        }
      }
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
  checkboxLabel(row?: Personal): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
  }
  // ====================================================================

}
