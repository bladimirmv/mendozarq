import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewUserComponent } from './components/new-user/new-user.component';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Usuario } from '@app/shared/models/usuario.interface';
import { EditUserComponent } from './components/edit-user/edit-user.component';

import { AuthService } from '@services/auth.service';
import { UsuarioService } from '@services/usuario.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LocationBarService } from '@app/core/services/location-bar.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<any>();
  expandedElement: Usuario | null;

  selected: Usuario[] = [];
  selection = new SelectionModel<Usuario>(true, []);
  filterValue: string;
  displayedColumns: string[] = ['seleccion', 'uuid', 'nombre', 'apellidos', 'rol', 'celular', 'direccion', 'correo', 'username', 'edit'];

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public usuarios$: Observable<Usuario[]>;
  public usuario: Usuario[];
  constructor(
    private snackBar: MatSnackBar,
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private authSvc: AuthService,
    private usuarioSvc: UsuarioService,
    public locationBarSvc: LocationBarService) {
  }



  ngOnInit(): void {

    this.getAllUsuarios();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);

    this.locationBarSvc.pushLocation({
      icon: 'contacts',
      name: 'Usuarios',
      link: 'usuarios'
    });
    this.locationBarSvc.pushLocation({
      icon: 'contacts',
      name: 'Usuarios',
      link: 'usuarios'
    });

  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.locationBarSvc.popLocation();
  }

  // ====================================================================
  getAllUsuarios(): void {

    this.usuarioSvc.getAllUsuarios()
      .subscribe(res => {
        this.dataSource.data = res;
        this.usuario = res;
      });
    this.usuarios$ = this.usuarioSvc.getAllUsuarios();
  }
  // ====================================================================
  onAddUser(): void {
    const dialogRef = this.dialog.open(NewUserComponent);
    dialogRef.afterClosed()
      .subscribe((res) => {
        this.getAllUsuarios();
      });
  }
  // ====================================================================
  oneditUser(user: Usuario): void {

    const dialogRef = this.dialog.open(EditUserComponent, { data: user });
    dialogRef.afterClosed()
      .subscribe((res) => {
        this.getAllUsuarios();
      });
  }
  // ====================================================================
  async ondeleteUser(): Promise<void> {
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
        this.selected.length === 1 ? this.deleteOneUsuario() : this.deleteMoreThanOneUsuario();
      }
    });

  }
  // ====================================================================
  deleteOneUsuario(): void {
    this.usuarioSvc
      .deleteUsuario(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usr => {
        if (usr) {
          this.toastSvc.success('Se ha eliminado correctamente', 'Usuario Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllUsuarios();
          this.clearCheckbox();
        } else {
          Swal.fire('Error!', 'Ocurrio un error al eliminar este usuario', 'error');
        }
      });
  }
  // ====================================================================
  deleteMoreThanOneUsuario(): void {
    this.selected.forEach((usuario, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.usuarioSvc
        .deleteUsuario(usuario.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastSvc.success('Se han eliminado correctamente', 'Usuarios Eliminados', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllUsuarios()
            this.clearCheckbox();
          }
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
