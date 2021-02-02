import { Component, OnInit, ViewChild } from '@angular/core';

import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { NewPersonalComponent } from './components/new-personal/new-personal.component';
import { EditPersonalComponent } from './components/edit-personal/edit-personal.component';
import { DeleteModalComponent } from './../../shared/components/delete-modal/delete-modal.component';
import { Personal } from '@models/mendozarq/personal.interface';
import { PersonalService } from '@app/core/services/mendozarq/personal.service';
@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  private destroy$ = new Subject<any>();
  public personal: Personal[];

  selected: Personal[] = [];
  selection = new SelectionModel<Personal>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion', 'activo', 'nombre', 'apellidos',
    'celular', 'correo', 'sueldo',
    'descripcion', 'direccion', 'edit'];

  dataSource: MatTableDataSource<Personal> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private personalSvc: PersonalService) {
  }

  // =====================> onInit
  ngOnInit(): void {
    this.getAllPersonal();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);

    // this.locationBarSvc.pushLocation({
    //   icon: 'contacts',
    //   name: 'Usuarios',
    //   link: 'usuarios'
    // });
  }
  // =====================> onDestroy
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    // this.locationBarSvc.popLocation();
  }

  // =====================> getAllPersonal
  getAllPersonal(): void {
    this.personalSvc.getAllPersonal()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.dataSource.data = res;
        this.personal = res;
      });
  }

  // =====================> onAddPersonal
  onAddPersonal(): void {
    const dialogRef = this.dialog.open(NewPersonalComponent);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.getAllPersonal();
      });
  }

  // =====================> oneditPersonal
  onUpdatePersonal(personal: Personal): void {
    const dialogRef = this.dialog.open(EditPersonalComponent, { data: personal });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllPersonal();
      });
  }

  // =====================> ondeletePersonal
  async onDeletePersonal(): Promise<void> {

    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOnePersonal()
            : this.deleteMoreThanOnePersonal();
        }
      });

  }

  // =====================> deleteOnePersonal
  deleteOnePersonal(): void {
    this.personalSvc
      .deletePersonal(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usr => {
        if (usr) {
          this.toastSvc.success('Se ha eliminado correctamente', 'Personal Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllPersonal();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOnePersonal
  deleteMoreThanOnePersonal(): void {
    this.selected.forEach((personal, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.personalSvc
        .deletePersonal(personal.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastSvc.success('Se han eliminado correctamente', 'Personal Eliminado', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllPersonal()
            this.clearCheckbox();
          }
        });

    });
  }

  // =====================> openSnackBarCopy
  openSnackBarCopy(): void {
    // this.snackBar.open('Copiado', 'Cerrar', {
    //   duration: 500,
    //   horizontalPosition: 'center',
    //   verticalPosition: 'bottom',
    // });
  }

  // !important, this part is for table.
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
  checkboxLabel(row?: Personal): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nombre}`;
  }

}
