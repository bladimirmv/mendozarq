import { Component, OnInit, ViewChild } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { ToastrService } from 'ngx-toastr';
import { ProyectoService } from '@services/mendozarq/proyecto.service';

import { NewProyectoComponent } from './components/new-proyecto/new-proyecto.component';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { EditProyectoComponent } from '@modules/proyectos/components/edit-proyecto/edit-proyecto.component';
import { Proyecto } from '@models/mendozarq/proyecto.interface';
import { Usuario } from '@models/usuario.interface';
import { type } from 'os';
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {
  private destroy$ = new Subject<any>();
  public proyectos: Proyecto[] = [];

  selected: Proyecto[] = [];
  selection = new SelectionModel<Proyecto>(true, []);
  filterValue: string;
  displayedColumns: string[] = [
    'seleccion', 'estado', 'nombre', 'porcentaje', 'cliente', 'categoria',
    'fechaInicio', 'fechaFinal', 'lugarProyecto', 'descripcion', 'edit'];

  dataSource: MatTableDataSource<Proyecto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public proyecto: Proyecto[];
  public $cliente: Observable<Usuario>;
  constructor(
    private toastSvc: ToastrService,
    public dialog: MatDialog,
    private proyectoSvc: ProyectoService) {
  }


  // =====================> onInit
  ngOnInit(): void {
    this.getAllProyecto();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source),
        takeUntil(this.destroy$))
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

  // =====================> getAllProyecto
  getAllProyecto(): void {
    this.proyectoSvc.getAllProyecto()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.dataSource.data = res;
        this.proyecto = res;
        this.proyectos = res;
      });
  }

  // =====================> onAddProyecto
  onAddProyecto(): void {
    const dialogRef = this.dialog.open(NewProyectoComponent);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllProyecto();
      });
  }

  // =====================> onUpdateProyecto
  onUpdateProyecto(proyecto: Proyecto): void {
    const dialogRef = this.dialog.open(EditProyectoComponent, { data: proyecto });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAllProyecto();
      });
  }

  // =====================> onDeleteProyecto
  async onDeleteProyecto(): Promise<void> {

    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selected.length === 1
            ? this.deleteOneProyecto()
            : this.deleteMoreThanOneProyecto();
        }
      });

  }

  // =====================> deleteOneProyecto
  deleteOneProyecto(): void {
    this.proyectoSvc
      .deleteProyecto(this.selected[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usr => {
        if (usr) {
          this.toastSvc.success('Se ha eliminado correctamente', 'Proyecto Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllProyecto();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOneProyecto
  deleteMoreThanOneProyecto(): void {
    this.selected.forEach((proyecto, index) => {
      const isLast: boolean = index + 1 === this.selected.length;
      this.proyectoSvc
        .deleteProyecto(proyecto.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastSvc.success('Se han eliminado correctamente', 'Proyecto Eliminado', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllProyecto()
            this.clearCheckbox();
          }
        });

    });
  }


  // !important, this part is for table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {

    typeof event === 'string'
      ? this.filterValue = event
      : this.filterValue = (event.target as HTMLInputElement).value;

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
  checkboxLabel(row?: Proyecto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nombre}`;
  }

}
