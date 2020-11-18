import { Component, OnInit, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { NewPersonalComponent } from './components/new-personal/new-personal.component';
import { EditPersonalComponent } from './components/edit-personal/edit-personal.component';
import { Personal } from '@models/mendozarq/personal.interface';
import { PersonalService } from '@services/personal.service';
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  selected: Personal[] = [];
  selection = new SelectionModel<Personal>(true, []);
  filterValue: string;
  displayedColumns: string[] = ['seleccion', 'nombre', 'apellidos', 'celular', 'direccion', 'correo', 'cargo', 'sueldo', 'edit'];

  dataSource: MatTableDataSource<Personal> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public personal: Personal[];
  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private personalSvc: PersonalService) {
  }

  ngOnInit(): void {
    this.personalSvc.getAllPersonal()
      .subscribe(res => {
        this.dataSource.data = res;
        this.personal = res;
      });


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }
  // ====================================================================
  onAddPersonal(): void {
    this.dialog.open(NewPersonalComponent);
  }
  // ====================================================================
  onUpdatePersonal(personal: Personal): void {
    this.dialog.open(EditPersonalComponent, { data: personal });
  }

  // ====================================================================
  ondeletePersonal(): void {
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

          this.personalSvc.deletePersonal(this.selected[0])
            .then(() => {
              this.toastSvc.success('Se ha eliminado correctamente', 'Personal Eliminado', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing'
              });
              this.clearCheckbox();
            })
            .catch(error => {
              console.log(error);
              Swal.fire('Error!', 'Ocurrio un error al eliminar el Personal', 'error');
            });

        } else {
          try {
            this.selected.forEach((personal, index) => {
              if (index + 1 === this.selected.length) {
                this.personalSvc.deletePersonal(personal)
                  .then(() => {
                    this.toastSvc.success('Se han eliminado correctamente', 'Personal Eliminado', {
                      timeOut: 2000,
                      progressBar: true,
                      progressAnimation: 'increasing'
                    });
                    this.clearCheckbox();
                  });
              } else {
                this.personalSvc.deletePersonal(personal);
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
