import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { VisitaProyecto } from '@models/mendozarq/visita.proyecto.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VisitaProyectoService } from '@services/mendozarq/visita-proyecto.service';
import { takeUntil } from 'rxjs/operators';
import { NewVisitaProyectoComponent } from './components/new-visita-proyecto/new-visita-proyecto.component';
import { EditVisitaProyectoComponent } from './components/edit-visita-proyecto/edit-visita-proyecto.component';
@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss']
})
export class VisitasComponent implements OnInit, OnDestroy {
  private destroy$: Subject<any> = new Subject<any>();
  private uuidProyecto: string;
  public visitas: VisitaProyecto[] = [];

  selected: VisitaProyecto[] = [];
  selection = new SelectionModel<VisitaProyecto>(true, []);
  filterValue: string;
  public columns: Array<string> = ['seleccion', 'nombre', 'faseDelProyecto', 'fecha', 'descripcion', 'edit'];
  public source: MatTableDataSource<VisitaProyecto> = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private visitaProyectoSvc: VisitaProyectoService,
    private dialog: MatDialog,
    private toastrSvc: ToastrService

  ) { }
  ngOnInit(): void {
    this.uuidProyecto = this.activatedRoute.snapshot.parent.parent.params.uuid;
    this.getAllVisitaProyecto();
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }


  // =====================> getAllVisitaProyecto
  private getAllVisitaProyecto(): void {
    this.visitaProyectoSvc
      .getAllVisitaProyecto(this.uuidProyecto)
      .pipe(takeUntil(this.destroy$))
      .subscribe((visitas: VisitaProyecto[]) => {
        this.source.data = visitas;
        this.visitas = visitas;
      })
  }
  // =====================> newPersonal
  public newServicio(): void {
    const visitaProyecto: VisitaProyecto = {
      uuidProyecto: this.uuidProyecto
    };
    const dialogRef = this.dialog.open(NewVisitaProyectoComponent, {
      data: visitaProyecto
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.getAllVisitaProyecto();
        }
      });
  }
  // =====================> deletePersonal
  public deleteServicio() {
    // const dialogRef = this.dialog.open(DeleteModalComponent);

    // dialogRef.afterClosed()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((res: boolean) => {
    //     if (res) {
    //       this.selectedServicio.length === 1
    //         ? this.deleteOneServicio()
    //         : this.deleteMoreThanOneServicio();
    //     }
    //   });
  }
  // =====================> deleteOnePersonal
  private deleteOneServicio(): void {
    // this.servicioProyectoSvc
    //   .deleteServicioProyecto(this.selectedServicio[0].uuid)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(usr => {
    //     if (usr) {
    //       this.toastrSvc.success('Se ha eliminado correctamente', 'Servicio Eliminado', {
    //         timeOut: 2000,
    //         progressBar: true,
    //         progressAnimation: 'increasing'
    //       });
    //       this.getAllServicioProyecto();
    //       this.clearCheckbox();
    //     }
    //   });
  }

  // =====================> deleteMoreThanOnePersonal
  private deleteMoreThanOneServicio(): void {
    // this.selectedServicio.forEach((servicio, index) => {
    //   const isLast: boolean = index + 1 === this.selectedServicio.length;
    //   this.servicioProyectoSvc
    //     .deleteServicioProyecto(servicio.uuid)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe(res => {
    //       if (res && isLast) {
    //         this.toastrSvc.success('Se han eliminado correctamente', 'Servicios Eliminado', {
    //           timeOut: 2000,
    //           progressBar: true,
    //           progressAnimation: 'increasing'
    //         });
    //         this.getAllServicioProyecto()
    //         this.clearCheckbox();
    //       }
    //     });

    // });
  }

  // =====================> updateServicio
  public updateServicio(visitaProyecto: VisitaProyecto): void {
    const dialogRef = this.dialog.open(EditVisitaProyectoComponent, { data: visitaProyecto });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.getAllVisitaProyecto();
        }
      });
  }





  // !important, this part is for servicioProyecto table.
  // =====================> applyFilter
  applyFilter(event: Event | string): void {
    typeof event === 'string'
      ? this.filterValue = event
      : this.filterValue = (event.target as HTMLInputElement).value;

    this.source.filter = this.filterValue.trim().toLowerCase();
    if (this.source.paginator) {
      this.source.paginator.firstPage();
    }
  }
  // =====================> isAllSelected
  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.source.data.length;
    return numSelected === numRows;
  }
  // =====================> masterToggle
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.source.data.forEach(row => this.selection.select(row));
  }
  // =====================> clearCheckbox
  clearCheckbox(): void {
    this.selection.clear();
  }
  // =====================> checkboxLabel
  checkboxLabel(row?: VisitaProyecto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.uuid}`;
  }

}
