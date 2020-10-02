import { AuthService } from '@services/auth.service';
import { NewUserComponent } from './components/new-user/new-user.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { map } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { Usuario } from '@app/shared/models/usuario.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsersComponent implements OnInit {
  expandedElement: Usuario | null;

  value = 'hola';

  selected: Usuario[] = [];
  selection = new SelectionModel<Usuario>(true, []);
  filterValue: string;
  // displayedColumns: string[] = ['seleccion', 'docid', 'rol', 'nombre', 'apellidos', 'celular', 'direccion', 'correo', 'edit'];
  displayedColumns: string[] = ['seleccion', 'rol', 'nombre', 'apellidos', 'edit'];

  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  data: Usuario[];

  constructor(
    private _snackBar: MatSnackBar,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private authSvc: AuthService) {



  }

  ngOnInit(): void {
    this.authSvc.getAllUsuarios()
      .subscribe(res => {
        this.dataSource.data = res;
      });


    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }

  showSuccess(): void {
    this.toastr.success('Hello world!', 'Toastr fun!', {

      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 500,
    });
  }


  openSnackBarCopy(): void {
    this._snackBar.open('Copiado', 'Cerrar', {
      duration: 500,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onAddUser(): void {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NewUserComponent);
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
    });
  }



  // ====================================================================
  deleteUser(): void {
    console.log(this.selected);
  }
  // ====================================================================
  editUser(user: Usuario): void {
    console.log(user);
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
