import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NewUserComponent } from './components/new-user/new-user.component';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { Usuario } from '@app/shared/models/usuario.interface';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { DeleteModalComponent } from './../../shared/components/delete-modal/delete-modal.component';

import { UsuarioService } from '@services/usuario.service';
import { ToastrService } from 'ngx-toastr';
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
  displayedColumns: string[] = [
    'seleccion', 'activo', 'nombre',
    'apellidos', 'rol', 'celular',
    'correo', 'username', 'direccion', 'edit'
  ];

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public usuarios$: Observable<Usuario[]>;
  public usuario: Usuario[];
  constructor(
    private snackBar: MatSnackBar,
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private usuarioSvc: UsuarioService,
    public locationBarSvc: LocationBarService
  ) {
  }

  // =====================> onInit
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
  }
  // =====================> onDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.locationBarSvc.popLocation();
  }

  // =====================> getAllUsuarios
  getAllUsuarios(): void {

    this.usuarioSvc.getAllUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.dataSource.data = res;
        this.usuario = res;
      });
    this.usuarios$ = this.usuarioSvc.getAllUsuarios();
  }

  // =====================> onAddUser
  onAddUser(): void {
    const dialogRef = this.dialog.open(NewUserComponent);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getAllUsuarios();
      });
  }

  // =====================> oneditUser
  oneditUser(user: Usuario): void {
    const dialogRef = this.dialog.open(EditUserComponent, { data: user });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllUsuarios();
      });
  }

  // =====================> ondeleteUser
  async ondeleteUser(): Promise<void> {

    const matDialogConfig: MatDialogConfig = {
      // width: '500px'
    };

    const dialogRef = this.dialog.open(DeleteModalComponent, matDialogConfig);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneUsuario()
            : this.deleteMoreThanOneUsuario();
        }
      });

  }

  // =====================> deleteOneUsuario
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
        }
      });
  }

  // =====================> deleteMoreThanOneUsuario
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

  // =====================> openSnackBarCopy
  openSnackBarCopy(): void {
    this.snackBar.open('Copiado', 'Cerrar', {
      duration: 500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  // =====================> applyFilter
  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;

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
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }

  // =====================> checkboxLabel
  checkboxLabel(row?: Usuario): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nombre}`;
  }
}
