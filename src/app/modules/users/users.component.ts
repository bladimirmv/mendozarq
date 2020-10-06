import { EditUserComponent } from './components/edit-user/edit-user.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NewUserComponent } from './components/new-user/new-user.component';
import { map } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Usuario } from '@app/shared/models/usuario.interface';

import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  expandedElement: Usuario | null;

  selected: Usuario[] = [];
  selection = new SelectionModel<Usuario>(true, []);
  filterValue: string;
  displayedColumns: string[] = ['seleccion', 'docid', 'rol', 'nombre', 'apellidos', 'celular', 'direccion', 'correo', 'edit'];

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public usuarios$: Observable<Usuario[]>;
  public usuario: Usuario[];
  constructor(
    private snackBar: MatSnackBar,
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private authSvc: AuthService) {
  }

  ngOnInit(): void {
    this.usuarios$ = this.authSvc.getAllUsuarios();
    this.authSvc.getAllUsuarios()
      .subscribe(res => {
        this.dataSource.data = res;
        this.usuario = res;
      });


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }
  // ====================================================================
  onAddUser(): void {
    this.dialog.open(NewUserComponent);
  }
  // ====================================================================
  oneditUser(user: Usuario): void {
    this.dialog.open(EditUserComponent, { data: user });
  }

  // ====================================================================
  ondeleteUser(): void {
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

          this.authSvc.deleteUsuario(this.selected[0].docid)
            .then(() => {
              this.toastSvc.success('Se ha eliminado correctamente', 'Usuario Eliminado', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing'
              });
              this.clearCheckbox();
            })
            .catch(error => {
              console.log(error);
              Swal.fire('Error!', 'Ocurrio un error al eliminar este usuario', 'error');
            });

        } else {
          try {
            this.selected.forEach((usuario, index) => {
              if (index + 1 === this.selected.length) {
                this.authSvc.deleteUsuario(usuario.docid)
                  .then(() => {
                    this.toastSvc.success('Se han eliminado correctamente', 'Usuarios Eliminados', {
                      timeOut: 2000,
                      progressBar: true,
                      progressAnimation: 'increasing'
                    });
                    this.clearCheckbox();
                  })
              } else {
                this.authSvc.deleteUsuario(usuario.docid);
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
  checkboxLabel(row?: Usuario): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nombre}`;
  }
  // ====================================================================
}
