import { Usuario } from './../../shared/models/usuario.interface';
import { AuthService } from '@services/auth.service';
import Swal from 'sweetalert2';
import { EditProyectoComponent } from '@modules/proyectos/components/edit-proyecto/edit-proyecto.component';
import { NewProyectoComponent } from './components/new-proyecto/new-proyecto.component';
import { ProyectoService } from './../../core/services/proyecto.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Proyecto } from './../../shared/models/mendozarq/proyecto.interface';

import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { getTreeMultipleDefaultNodeDefsError } from '@angular/cdk/tree';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {

  selected: Proyecto[] = [];
  selection = new SelectionModel<Proyecto>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion', 'nombre', 'porcentaje', 'cliente', 'categoria', 'estado',
    'fechaInicio', 'fechaFinal', 'lugarProyecto', 'descripcion', 'documento', 'edit'];

  dataSource: MatTableDataSource<Proyecto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public proyecto: Proyecto[];
  public $cliente: Observable<Usuario>;
  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private proyectoSvc: ProyectoService,
    private authSvc: AuthService) {
  }

  ngOnInit(): void {
    this.dataSource.data = [{
      idProyecto: '123',
      categoria: ['construccion'],
      nombre: 'PROYECTO 1',
      descripcion: 'primero proyecto creado',
      estado: true,
      fechaInicio: new Date(),
      fechaFinal: new Date(),
      lugarProyecto: 'av segunda',
      cliente: 'bladimir',
      nombreCliente: 'blaidmir',
      porcentaje: 90,
    }, {
      idProyecto: '123',
      categoria: ['construccion'],
      nombre: 'PROYECTO 2',
      descripcion: 'primero proyecto creado',
      estado: true,
      fechaInicio: new Date(),
      fechaFinal: new Date(),
      lugarProyecto: 'av segunda',
      cliente: 'bladimir',
      nombreCliente: 'blaidmir',
      porcentaje: 10,
    },
    {
      idProyecto: '123',
      categoria: ['construccion'],
      nombre: 'ejemplo proyecto',
      descripcion: 'primero proyecto creado',
      estado: true,
      fechaInicio: new Date(),
      fechaFinal: new Date(),
      lugarProyecto: 'av segunda',
      cliente: 'bladimir',
      nombreCliente: 'blaidmir',
      porcentaje: 60,
    }
    ] as Proyecto[];
    // this.proyecto = ;
    // this.proyectoSvc.getAllProyectos()
    //   .subscribe(res => {
    //     this.dataSource.data = res;
    //     this.proyecto = res;
    //   });


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }

  getCliente(id: string): any {
    // return this.authSvc.getOneUsuario(id);
  }
  // ====================================================================
  onAddProyecto(): void {
    this.dialog.open(NewProyectoComponent);
  }
  // ====================================================================
  onUpdatePersonal(proyecto: Proyecto): void {
    this.dialog.open(EditProyectoComponent, { data: proyecto });
  }

  // ====================================================================
  ondeleteProyecto(): void {
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

          this.proyectoSvc.deleteProyecto(this.selected[0])
            .then(() => {
              this.toastSvc.success('Se ha eliminado correctamente', 'Proyecto Eliminado', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing'
              });
              this.clearCheckbox();
            })
            .catch(error => {
              console.log(error);
              Swal.fire('Error!', 'Ocurrio un error al eliminar el Proyecto', 'error');
            });

        } else {
          try {
            this.selected.forEach((proyecto, index) => {
              if (index + 1 === this.selected.length) {
                this.proyectoSvc.deleteProyecto(proyecto)
                  .then(() => {
                    this.toastSvc.success('Se han eliminado correctamente', 'Proyecto Eliminado', {
                      timeOut: 2000,
                      progressBar: true,
                      progressAnimation: 'increasing'
                    });
                    this.clearCheckbox();
                  });
              } else {
                this.proyectoSvc.deleteProyecto(proyecto);
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
  checkboxLabel(row?: Proyecto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} `;
  }
  // ====================================================================

}
