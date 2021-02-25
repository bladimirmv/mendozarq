import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { DeleteModalComponent } from '@app/shared/components/delete-modal/delete-modal.component';
import { ServicioProyecto } from '@models/mendozarq/servicio.proyecto.interface';

import { ServicioProyectoService } from '@services/mendozarq/servicio-proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { EditServicioComponent } from './components/edit-servicio/edit-servicio.component';
import { NewServicioComponent } from './components/new-servicio/new-servicio.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss']
})
export class ServicioComponent implements OnInit, OnDestroy {

  private destroy$: Subject<any> = new Subject<any>();
  private uuidProyecto: string = '';
  public servicios: ServicioProyecto[];


  selectedServicio: ServicioProyecto[] = [];
  selectionServicio = new SelectionModel<ServicioProyecto>(true, []);
  @ViewChild(MatSort, { static: true }) sortPersonal: MatSort;
  filterValuePersonal: string;
  public columns: Array<string> = ['seleccion', 'nombre', 'avance', 'fechaInicio', 'fechaFinal', 'descripcion', 'edit'];
  public source: MatTableDataSource<ServicioProyecto> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private activatedRoute: ActivatedRoute,
    private servicioProyectoSvc: ServicioProyectoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService
  ) { }

  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    this.getAllServicioProyecto();

    this.source.paginator = this.paginator;
    this.source.sort = this.sort;

    this.selectionServicio.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selectedServicio = data.selected);
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // =====================> getAllServicioProyecto
  private getAllServicioProyecto(): void {
    this.servicioProyectoSvc
      .getAllServicioProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((servicio: ServicioProyecto[]) => {
        this.source.data = servicio;
        this.servicios = servicio;
      })
  }
  // =====================> newPersonal
  public newServicio(): void {
    const servicioProyecto: ServicioProyecto = {
      uuidProyecto: this.uuidProyecto
    };
    const dialogRef = this.dialog.open(NewServicioComponent, {
      data: servicioProyecto
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllServicioProyecto();
        }
      });
  }
  // =====================> deletePersonal
  public deleteServicio() {
    const dialogRef = this.dialog.open(DeleteModalComponent);

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.selectedServicio.length === 1
            ? this.deleteOneServicio()
            : this.deleteMoreThanOneServicio();
        }
      });
  }
  // =====================> deleteOnePersonal
  private deleteOneServicio(): void {
    this.servicioProyectoSvc
      .deleteServicioProyecto(this.selectedServicio[0].uuid)
      .pipe(takeUntil(this.destroy$))
      .subscribe(usr => {
        if (usr) {
          this.toastrSvc.success('Se ha eliminado correctamente', 'Servicio Eliminado', {
            timeOut: 2000,
            progressBar: true,
            progressAnimation: 'increasing'
          });
          this.getAllServicioProyecto();
          this.clearCheckbox();
        }
      });
  }

  // =====================> deleteMoreThanOnePersonal
  private deleteMoreThanOneServicio(): void {
    this.selectedServicio.forEach((servicio, index) => {
      const isLast: boolean = index + 1 === this.selectedServicio.length;
      this.servicioProyectoSvc
        .deleteServicioProyecto(servicio.uuid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res && isLast) {
            this.toastrSvc.success('Se han eliminado correctamente', 'Servicios Eliminado', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing'
            });
            this.getAllServicioProyecto()
            this.clearCheckbox();
          }
        });

    });
  }


  public updateServicio(servicioProyecto: ServicioProyecto): void {
    const dialogRef = this.dialog.open(EditServicioComponent, { data: servicioProyecto });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllServicioProyecto();
        }
      });
  }


  // !important, this part is for servicioProyecto table.
  // =====================> applyFilterPersonal
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValuePersonal = event
      : this.filterValuePersonal = (event.target as HTMLInputElement).value;

    this.source.filter = this.filterValuePersonal.trim().toLowerCase();
    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }
  // =====================> isAllSelectedPersonal
  isAllSelectedServicio(): any {
    const numSelected = this.selectionServicio.selected.length;
    const numRows = this.source.data.length;
    return numSelected === numRows;
  }
  // =====================> masterTogglePersonal
  masterToggle(): void {
    this.isAllSelectedServicio() ?
      this.selectionServicio.clear() :
      this.source.data.forEach(row => this.selectionServicio.select(row));
  }
  // =====================> clearCheckboxPersonal
  clearCheckbox(): void {
    this.selectionServicio.clear();
  }
  // =====================> checkboxLabelPersonal
  checkboxLabel(row?: ServicioProyecto): string {
    if (!row) {
      return `${this.isAllSelectedServicio() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectionServicio.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }


}
